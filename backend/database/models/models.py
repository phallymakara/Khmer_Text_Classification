from sqlalchemy import Column, Integer, String, Text, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    
    # Relationship to link documents to categories
    documents = relationship("Document", back_populates="category")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    confidence_score = Column(Numeric(5, 4))
    model_version = Column(String(20)) # Track which model version made the prediction
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="documents")
    history_logs = relationship("HistoryLog", back_populates="document")

class HistoryLog(Base):
    __tablename__ = "history_log"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"))
    action_type = Column(String(50)) # Will be 'PREDICTION' via the SQL trigger
    category_id = Column(Integer, ForeignKey("categories.id"))
    confidence_score = Column(Numeric(5, 4))
    model_version = Column(String(20))
    prediction_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to link back to the document
    document = relationship("Document", back_populates="history_logs")