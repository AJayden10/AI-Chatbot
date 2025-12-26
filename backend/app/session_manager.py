from typing import Dict
from datetime import datetime

class SessionManager:
    """Simple in-memory session manager for conversations.

    Not persistent — suitable for Week 1. Replace with Redis/DB for production.
    """
    def __init__(self):
        self.sessions: Dict[str, Dict] = {}

    def get(self, session_id: str):
        return self.sessions.get(session_id)

    def create(self, session_id: str, user_id=None):
        if session_id in self.sessions:
            return self.sessions[session_id]
        self.sessions[session_id] = {
            'session_id': session_id,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'messages': []
        }
        return self.sessions[session_id]

    def add_message(self, session_id: str, role: str, content: str):
        s = self.sessions.get(session_id) or self.create(session_id)
        entry = {'role': role, 'content': content, 'created_at': datetime.utcnow()}
        s['messages'].append(entry)
        return entry

# Module-level singleton for easy import
session_manager = SessionManager()
