from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
import logging
import json
import asyncio

# Internal imports based on your structure
from database.base import wait_for_db
from database.models.models import Document
from utils.predictor import classify_text
from utils.db_session import get_db

# Initialize FastAPI
app = FastAPI(
    title="Khmer Text Classification API",
    description="Professional API for single and batch Khmer text classification",
    version="1.1.0"
)

# --- CATEGORY MAPPING (For History fallback) ---
CATEGORY_MAP = {
    1: "Economic",
    2: "Entertainment",
    3: "Politic",
    4: "Life",
    5: "Sport",
    6: "Technology"
}

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database is reachable on startup
try:
    wait_for_db()
    print("✅ System: Database connection verified.")
except Exception as e:
    print(f"❌ System: Database connection failed: {e}")


@app.post("/classify")
def predict_and_store(content: str, db: Session = Depends(get_db)):
    """
    Single text classification endpoint.
    """
    if not content.strip():
        raise HTTPException(status_code=400, detail="Text content is required")

    try:
        top_results = classify_text(content)
        primary_result = top_results[0]
        
        # Save to DB
        new_doc = Document(
            content=content,
            category_id=primary_result["category_id"],
            confidence_score=primary_result["score"],
            model_version="v1.0.0"
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        
        return {
            "status": "success",
            "primary_category": primary_result["category_name"],
            "top_predictions": top_results,
            "document_id": new_doc.id
        }
    except Exception as e:
        logging.error(f"Single Inference Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal AI Engine Error")


@app.post("/classify-bulk")
async def bulk_classify(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Bulk classification: Processes CSV or Excel files line-by-line.
    """
    # 1. Read the file into memory as bytes
    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            # FIX: BytesIO + utf-8 ensures Khmer script doesn't break
            df = pd.read_csv(io.BytesIO(contents), encoding='utf-8')
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported format. Upload CSV or Excel.")
    except Exception as e:
        logging.error(f"File Read Error: {e}")
        raise HTTPException(status_code=400, detail="Error reading file. Ensure it is valid CSV/Excel.")

    # 2. Identify the Text Column
    # Looks for 'text' or 'content' headers
    target_col = next((c for c in df.columns if c.lower() in ['text', 'content']), None)
    if not target_col:
        raise HTTPException(status_code=400, detail="No text column found. Please use 'text' or 'content' as a header.")

    # 3. Batch Processing Loop (Line-by-Line)
    results = []
    
    # We iterate line by line as requested
    for index, row in df.iterrows():
        text_line = str(row[target_col]).strip()
        
        # Only process if the line is not empty
        if text_line and text_line.lower() != 'nan':
            try:
                # Predict current line
                prediction_output = classify_text(text_line)
                primary = prediction_output[0]
                
                results.append({
                    "id": index + 1,
                    "preview": text_line[:100], # Preview for the UI
                    "category": primary["category_name"],
                    "confidence": round(primary["score"], 4)
                })
            except Exception as e:
                logging.error(f"Row {index} prediction failed: {e}")
                continue # Keep going even if one line fails

    return {
        "status": "success",
        "filename": file.filename,
        "processed_count": len(results),
        "predictions": results
    }


@app.get("/history")
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """
    Fetches latest classification logs.
    """
    try:
        history = db.query(Document).order_by(Document.created_at.desc()).limit(limit).all()
        return [
            {
                "id": doc.id,
                "content": doc.content,
                "category": CATEGORY_MAP.get(doc.category_id, "Unknown"),
                "score": doc.confidence_score,
                "created_at": doc.created_at
            } for doc in history
        ]
    except Exception as e:
        logging.error(f"History Access Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")
    

@app.post("/classify-bulk-stream")
async def bulk_classify_stream(file: UploadFile = File(...)):
    contents = await file.read()
    
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents), encoding='utf-8')
    else:
        df = pd.read_excel(io.BytesIO(contents))

    target_col = next((c for c in df.columns if c.lower() in ['text', 'content']), None)
    total_rows = len(df)

    async def event_generator():
        processed_count = 0
        for index, row in df.iterrows():
            text_line = str(row[target_col]).strip()
            
            if text_line and text_line.lower() != 'nan':
                # Run Inference
                predictions = classify_text(text_line)
                primary = predictions[0]
                processed_count += 1
                
                # Create the data payload
                data = {
                    "current": processed_count,
                    "total": total_rows,
                    "prediction": {
                        "id": index + 1,
                        "preview": text_line[:100],
                        "category": primary["category_name"]
                    }
                }
                
                # Yield the event in SSE format
                yield f"data: {json.dumps(data)}\n\n"
                
                # Small sleep to ensure the event loop handles the stream smoothly
                await asyncio.sleep(0.01)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/health")
def health_check():
    return {"status": "online", "version": "1.1.0"}