"""
Knowledge Base Service for retrieving relevant context
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import KnowledgeBase
from typing import List, Optional

class KnowledgeService:
    """Handles knowledge base retrieval"""
    
    def search(self, db: Session, query: str, limit: int = 3) -> List[KnowledgeBase]:
        """
        Search knowledge base for relevant entries
        Simple keyword matching - can be enhanced with vector search
        """
        query_lower = query.lower()
        
        # Search in title, content, and tags
        results = db.query(KnowledgeBase).filter(
            KnowledgeBase.is_active == True
        ).filter(
            or_(
                KnowledgeBase.title.ilike(f"%{query}%"),
                KnowledgeBase.content.ilike(f"%{query}%"),
                KnowledgeBase.category.ilike(f"%{query}%")
            )
        ).limit(limit).all()
        
        return results
    
    def get_context_string(self, entries: List[KnowledgeBase]) -> str:
        """Convert knowledge base entries to context string"""
        if not entries:
            return ""
        
        context_parts = []
        for entry in entries:
            context_parts.append(f"Q: {entry.title}\nA: {entry.content}\n")
        
        return "\n".join(context_parts)
