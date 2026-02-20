"""
Knowledge Base CRUD endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.models import KnowledgeBase

router = APIRouter()

class KnowledgeBaseCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class KnowledgeBaseUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None

class KnowledgeBaseResponse(BaseModel):
    id: int
    title: str
    content: str
    category: Optional[str]
    tags: Optional[List[str]]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=KnowledgeBaseResponse)
async def create_knowledge_entry(
    entry: KnowledgeBaseCreate,
    db: Session = Depends(get_db)
):
    """Create a new knowledge base entry"""
    db_entry = KnowledgeBase(
        title=entry.title,
        content=entry.content,
        category=entry.category,
        tags=entry.tags or []
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[KnowledgeBaseResponse])
async def list_knowledge_entries(
    category: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    """List all knowledge base entries"""
    query = db.query(KnowledgeBase)
    
    if category:
        query = query.filter(KnowledgeBase.category == category)
    if is_active is not None:
        query = query.filter(KnowledgeBase.is_active == is_active)
    
    entries = query.order_by(KnowledgeBase.created_at.desc()).all()
    return entries

@router.get("/{entry_id}", response_model=KnowledgeBaseResponse)
async def get_knowledge_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific knowledge base entry"""
    entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.put("/{entry_id}", response_model=KnowledgeBaseResponse)
async def update_knowledge_entry(
    entry_id: int,
    entry_update: KnowledgeBaseUpdate,
    db: Session = Depends(get_db)
):
    """Update a knowledge base entry"""
    entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if entry_update.title is not None:
        entry.title = entry_update.title
    if entry_update.content is not None:
        entry.content = entry_update.content
    if entry_update.category is not None:
        entry.category = entry_update.category
    if entry_update.tags is not None:
        entry.tags = entry_update.tags
    if entry_update.is_active is not None:
        entry.is_active = entry_update.is_active
    
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
async def delete_knowledge_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """Delete a knowledge base entry (soft delete by setting is_active=False)"""
    entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry.is_active = False
    db.commit()
    return {"message": "Entry deactivated successfully"}
