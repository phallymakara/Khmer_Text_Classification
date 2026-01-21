from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

# Internal imports from your project structure
from database.base import wait_for_db
from database.models.models import Document
from utils.predictor import classify_text
from utils.db_session import get_db

# Initialize FastAPI
app = FastAPI(
    title="Khmer Text Classification API",
    description="API for classifying Khmer text into Economic, Sport, Technology, etc.",
    version="1.0.0"
)

# Ensure database is reachable before accepting requests
# This is critical when running in Docker to prevent crashes
try:
    wait_for_db()
    print("Successfully connected to the database!")
except Exception as e:
    print(f"Database connection failed: {e}")

@app.post("/classify")
def predict_and_store(content: str, db: Session = Depends(get_db)):
    """
    Receives Khmer text, predicts the top 3 categories, 
    and saves the primary result to the database.
    """
    try:
        # 1. Run the ML Pipeline logic from utils/
        # Returns: list of dicts [{"category_id": 5, "category_name": "Sport", "score": 2.1}, ...]
        top_results = classify_text(content)
        
        # 2. Extract the primary (highest score) result for storage
        primary_result = top_results[0]
        
        # 3. Create the Database Record
        # Matches your 'documents' table columns
        new_doc = Document(
            content=content,
            category_id=primary_result["category_id"],
            confidence_score=primary_result["score"],
            model_version="v1.0-svc-compressed"
        )
        
        # 4. Save to PostgreSQL
        # Note: Your SQL Trigger 'trigger_log_prediction' will 
        # automatically create a record in 'history_log' after this commit.
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        
        # 5. Return success response with full analysis
        return {
            "status": "success",
            "document_id": new_doc.id,
            "prediction": primary_result["category_name"],
            "top_3_analysis": top_results,
            "timestamp": new_doc.created_at
        }

    except Exception as e:
        # Log the error for Docker logs visibility
        logging.error(f"Classification Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Server Error: {str(e)}"
        )

@app.get("/health")
def health_check():
    """Simple endpoint to verify the API is alive."""
    return {"status": "healthy", "model_loaded": True}