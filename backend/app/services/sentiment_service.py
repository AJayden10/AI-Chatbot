"""
Sentiment Analysis Service using VADER
"""
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from app.config import settings

class SentimentService:
    """Handles sentiment analysis of messages"""
    
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
    
    def analyze(self, text: str) -> dict:
        """
        Analyze sentiment of text
        Returns: {
            "score": float (-1 to 1),
            "label": str ("positive", "neutral", "negative")
        }
        """
        scores = self.analyzer.polarity_scores(text)
        compound_score = scores["compound"]
        
        # Determine label
        if compound_score >= 0.05:
            label = "positive"
        elif compound_score <= -0.05:
            label = "negative"
        else:
            label = "neutral"
        
        return {
            "score": compound_score,
            "label": label,
            "scores": scores  # For debugging
        }
    
    def should_escalate(self, sentiment_score: float) -> bool:
        """Check if conversation should be escalated based on sentiment"""
        return sentiment_score < settings.negative_sentiment_threshold
