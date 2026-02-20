"""
Analytics endpoints for dashboard
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db
from app.models import Conversation, Message

router = APIRouter()

@router.get("/summary")
async def get_analytics_summary(
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """
    Get overall analytics summary
    - Total conversations
    - Sentiment distribution
    - Conversation volume over time
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Total conversations
    total_conversations = db.query(Conversation).filter(
        Conversation.started_at >= cutoff_date
    ).count()
    
    # Active conversations
    active_conversations = db.query(Conversation).filter(
        Conversation.status == "active"
    ).count()
    
    # Escalated conversations
    escalated_conversations = db.query(Conversation).filter(
        Conversation.status == "escalated"
    ).count()
    
    # Sentiment distribution
    sentiment_stats = db.query(
        Message.sentiment_label,
        func.count(Message.id).label("count")
    ).filter(
        Message.created_at >= cutoff_date,
        Message.role == "user"
    ).group_by(Message.sentiment_label).all()
    
    sentiment_distribution = {
        "positive": 0,
        "neutral": 0,
        "negative": 0
    }
    
    for label, count in sentiment_stats:
        if label in sentiment_distribution:
            sentiment_distribution[label] = count
    
    return {
        "total_conversations": total_conversations,
        "active_conversations": active_conversations,
        "escalated_conversations": escalated_conversations,
        "sentiment_distribution": sentiment_distribution
    }

@router.get("/conversation-volume")
async def get_conversation_volume(
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """
    Get conversation volume over time (daily)
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    daily_counts = db.query(
        func.date(Conversation.started_at).label("date"),
        func.count(Conversation.id).label("count")
    ).filter(
        Conversation.started_at >= cutoff_date
    ).group_by(
        func.date(Conversation.started_at)
    ).order_by(
        func.date(Conversation.started_at)
    ).all()
    
    return [
        {
            "date": str(date),
            "count": count
        }
        for date, count in daily_counts
    ]

@router.get("/sentiment-trends")
async def get_sentiment_trends(
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """
    Get sentiment trends over time
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    daily_sentiment = db.query(
        func.date(Message.created_at).label("date"),
        Message.sentiment_label,
        func.count(Message.id).label("count")
    ).filter(
        Message.created_at >= cutoff_date,
        Message.role == "user",
        Message.sentiment_label.isnot(None)
    ).group_by(
        func.date(Message.created_at),
        Message.sentiment_label
    ).order_by(
        func.date(Message.created_at)
    ).all()
    
    # Organize by date
    trends = {}
    for date, label, count in daily_sentiment:
        date_str = str(date)
        if date_str not in trends:
            trends[date_str] = {"positive": 0, "neutral": 0, "negative": 0}
        if label in trends[date_str]:
            trends[date_str][label] = count
    
    return [
        {
            "date": date,
            **sentiments
        }
        for date, sentiments in trends.items()
    ]

@router.get("/top-categories")
async def get_top_categories(
    limit: Optional[int] = 10,
    db: Session = Depends(get_db)
):
    """
    Get most common query categories (placeholder - can be enhanced with topic modeling)
    """
    # This is a simplified version
    # In production, you'd use NLP to categorize messages
    return {
        "categories": [
            {"name": "Order Status", "count": 45},
            {"name": "Product Information", "count": 32},
            {"name": "Account Issues", "count": 28},
            {"name": "Billing", "count": 22},
            {"name": "Returns", "count": 18}
        ]
    }
