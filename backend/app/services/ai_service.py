"""
AI Service for generating responses using OpenAI/Gemini
"""
import os
from typing import List, Dict
from openai import OpenAI
from app.config import settings

class AIService:
    """Handles AI response generation"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-3.5-turbo"  # Can be upgraded to gpt-4
    
    async def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]] = None,
        knowledge_context: str = ""
    ) -> str:
        """
        Generate AI response based on user message and context
        """
        # Build system prompt
        system_prompt = """You are ServicePilot, a helpful and friendly AI customer service assistant.
Your goal is to provide accurate, concise, and helpful responses to customer inquiries.
Be professional, empathetic, and solution-oriented.
If you don't know something, acknowledge it and offer to help find the answer."""
        
        if knowledge_context:
            system_prompt += f"\n\nRelevant context:\n{knowledge_context}"
        
        # Build messages list
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        else:
            messages.append({"role": "user", "content": user_message})
        
        # If we have history, add the current message
        if conversation_history:
            messages.append({"role": "user", "content": user_message})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            # Fallback response if API fails
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our support team for immediate assistance."
