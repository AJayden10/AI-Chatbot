from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..db import get_db
from ..session_manager import session_manager
from .. import models
from sqlalchemy.orm import Session
from datetime import datetime

router = APIRouter()

class MessageRequest(BaseModel):
    session_id: str
    user_id: int | None = None
    content: str

class MessageResponse(BaseModel):
    reply: str
    sentiment: str
    session_id: str

@router.post("/message", response_model=MessageResponse)
def post_message(req: MessageRequest, db: Session = Depends(get_db)):
    # Ensure conversation exists
    conv = db.query(models.Conversation).filter_by(session_id=req.session_id).first()
    if not conv:
        conv = models.Conversation(session_id=req.session_id, user_id=req.user_id)
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Store user message
    user_msg = models.Message(conversation_id=conv.id, role='user', content=req.content)
    db.add(user_msg)
    db.commit()

    # Add to session manager
    session_manager.add_message(req.session_id, 'user', req.content)

    # --- Placeholder reply logic ---
    reply_text = f"Echo: {req.content}"
    sentiment = 'neutral'

    # Store bot reply
    bot_msg = models.Message(conversation_id=conv.id, role='bot', content=reply_text)
    db.add(bot_msg)
    db.commit()

    session_manager.add_message(req.session_id, 'bot', reply_text)

    return MessageResponse(reply=reply_text, sentiment=sentiment, session_id=req.session_id)
