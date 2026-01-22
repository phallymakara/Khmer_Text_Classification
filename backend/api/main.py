from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

# Internal imports
from database.base import wait_for_db
from database.models.models import Document
from utils.predictor import classify_text
from utils.db_session import get_db

# Initialize FastAPI
app = FastAPI(
    title="Khmer Text Classification API",
    version="1.0.0"
)

# --- CATEGORY MAPPING ---
# Translates numeric IDs to human-readable labels
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

# Database connection check on startup
try:
    wait_for_db()
    print("✅ System: Database connection verified.")
except Exception as e:
    print(f"❌ System: Database connection failed: {e}")

@app.post("/classify")
def predict_and_store(content: str, db: Session = Depends(get_db)):
    """
    Classifies Khmer text and saves the result to the database.
    """
    if not content.strip():
        raise HTTPException(status_code=400, detail="Text content is required")

    try:
        # 1. ML Inference logic
        top_results = classify_text(content)
        primary_result = top_results[0]
        
        # 2. Create DB Record
        new_doc = Document(
            content=content,
            category_id=primary_result["category_id"],
            confidence_score=primary_result["score"],
            model_version="v1.0.0"
        )
        
        # 3. Commit to PostgreSQL
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        
        return {
            "status": "success",
            "primary_category": primary_result["category_name"],
            "top_predictions": top_results,
            "document_id": new_doc.id,
            "timestamp": new_doc.created_at
        }

    except Exception as e:
        logging.error(f"Inference Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal AI Engine Error")

@app.get("/history")
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """
    Fetches latest history and maps IDs to Category Names for the UI.
    """
    try:
        # Fetching documents from the 'Document' model
        history = db.query(Document).order_by(Document.created_at.desc()).limit(limit).all()
        
        # Mapping numeric category_id to human-readable strings
        formatted_history = [
            {
                "id": doc.id,
                "content": doc.content,
                "category": CATEGORY_MAP.get(doc.category_id, "Unknown"),
                "score": doc.confidence_score,
                "created_at": doc.created_at
            } for doc in history
        ]
        
        return formatted_history

    except Exception as e:
        logging.error(f"History Access Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history logs")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "v1.0.0"}