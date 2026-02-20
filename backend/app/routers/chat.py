"""
Chat endpoint for handling user messages
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.models import Conversation, Message
from app.session_manager import session_manager
from app.services.ai_service import AIService
from app.services.sentiment_service import SentimentService
from app.services.knowledge_service import KnowledgeService

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    sentiment: str
    sentiment_score: float
    escalated: bool = False

@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Handle incoming chat messages
    - Creates session if needed
    - Analyzes sentiment
    - Generates AI response
    - Stores message in database
    """
    # Get or create session
    if not request.session_id:
        session_id = session_manager.create_session()
    else:
        session = session_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        session_id = request.session_id
    
    # Get conversation
    conversation = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Analyze sentiment
    sentiment_service = SentimentService()
    sentiment_result = sentiment_service.analyze(request.message)
    
    # Store user message
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        sentiment_score=sentiment_result["score"],
        sentiment_label=sentiment_result["label"]
    )
    db.add(user_message)
    db.commit()
    
    # Check for escalation (strong negative sentiment)
    escalated = False
    if sentiment_result["score"] < -0.5:
        conversation.status = "escalated"
        escalated = True
        db.commit()
    
    # Retrieve relevant knowledge base entries
    knowledge_service = KnowledgeService()
    kb_entries = knowledge_service.search(db, request.message)
    knowledge_context = knowledge_service.get_context_string(kb_entries)
    
    # Generate AI response
    ai_service = AIService()
    
    # Get conversation history for context
    previous_messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at.desc()).limit(10).all()
    
    # Reverse to get chronological order
    history = [{"role": msg.role, "content": msg.content} for msg in reversed(previous_messages)]
    
    ai_response = await ai_service.generate_response(
        user_message=request.message,
        conversation_history=history,
        knowledge_context=knowledge_context
    )
    
    # Store AI response
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response,
        sentiment_score=None,
        sentiment_label=None
    )
    db.add(assistant_message)
    db.commit()
    
    return ChatResponse(
        reply=ai_response,
        session_id=session_id,
        sentiment=sentiment_result["label"],
        sentiment_score=sentiment_result["score"],
        escalated=escalated
    )

@router.get("/conversations/{session_id}")
async def get_conversation(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get all messages for a conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
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
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]
    }
