from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    email = Column(String(256), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(Integer, primary_key=True)
    session_id = Column(String(128), unique=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'), index=True)
    role = Column(String(16))  # 'user' | 'bot' | 'system'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    conversation = relationship("Conversation", back_populates="messages")

class KnowledgeBase(Base):
    __tablename__ = 'knowledge_base'
    id = Column(Integer, primary_key=True)
    title = Column(String(256))
    content = Column(Text)
    tags = Column(String(256))
    created_at = Column(DateTime, default=datetime.utcnow)
