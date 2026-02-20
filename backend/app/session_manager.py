"""
Session management for conversations
"""
import uuid
from datetime import datetime
from typing import Dict, Optional
from app.database import SessionLocal
from app.models import Conversation

class SessionManager:
    """Manages conversation sessions"""
    
    def __init__(self):
        self.active_sessions: Dict[str, Conversation] = {}
    
    def create_session(self, user_id: Optional[int] = None) -> str:
        """Create a new conversation session"""
        session_id = str(uuid.uuid4())
        db = SessionLocal()
        try:
            conversation = Conversation(
                session_id=session_id,
                user_id=user_id,
                status="active"
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            self.active_sessions[session_id] = conversation
            return session_id
        finally:
            db.close()
    
    def get_session(self, session_id: str) -> Optional[Conversation]:
        """Get a conversation session"""
        if session_id in self.active_sessions:
            return self.active_sessions[session_id]
        
        db = SessionLocal()
        try:
            conversation = db.query(Conversation).filter(
                Conversation.session_id == session_id
            ).first()
            if conversation:
                self.active_sessions[session_id] = conversation
            return conversation
        finally:
            db.close()
    
    def end_session(self, session_id: str):
        """End a conversation session"""
        db = SessionLocal()
        try:
            conversation = db.query(Conversation).filter(
                Conversation.session_id == session_id
            ).first()
            if conversation:
                conversation.status = "ended"
                conversation.ended_at = datetime.utcnow()
                db.commit()
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
        finally:
            db.close()

# Global session manager instance
session_manager = SessionManager()
