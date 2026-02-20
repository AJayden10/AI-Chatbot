"""
Admin endpoints for conversation history and customization
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.models import Conversation, Message

router = APIRouter()

class ConversationListItem(BaseModel):
    id: int
    session_id: str
    started_at: datetime
    ended_at: Optional[datetime]
    status: str
    message_count: int
    
    class Config:
        from_attributes = True

class CustomizationSettings(BaseModel):
    greeting_message: str = "Hello! I'm ServicePilot, your AI assistant. How can I help you today?"
    fallback_response: str = "I'm not sure how to help with that. Let me connect you with a human agent."

# In-memory settings (in production, store in database)
customization_settings = CustomizationSettings()

@router.get("/conversations", response_model=List[ConversationListItem])
async def list_conversations(
    limit: Optional[int] = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all conversations with filters"""
    query = db.query(Conversation)
    
    if status:
        query = query.filter(Conversation.status == status)
    
    conversations = query.order_by(desc(Conversation.started_at)).limit(limit).all()
    
    # Add message count
    result = []
    for conv in conversations:
        message_count = db.query(Message).filter(Message.conversation_id == conv.id).count()
        result.append({
            "id": conv.id,
            "session_id": conv.session_id,
            "started_at": conv.started_at,
            "ended_at": conv.ended_at,
            "status": conv.status,
            "message_count": message_count
        })
    
    return result

@router.get("/conversations/{session_id}/messages")
async def get_conversation_messages(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get all messages for a specific conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        return {"error": "Conversation not found"}
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at.asc()).all()
    
    return {
        "session_id": session_id,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "sentiment": msg.sentiment_label,
                "sentiment_score": msg.sentiment_score,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]
    }

@router.get("/settings")
async def get_customization_settings():
    """Get current customization settings"""
    return customization_settings

@router.put("/settings")
async def update_customization_settings(
    settings: CustomizationSettings
):
    """Update customization settings"""
    global customization_settings
    customization_settings = settings
    return {"message": "Settings updated successfully", "settings": settings}
