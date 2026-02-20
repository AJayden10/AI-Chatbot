"""
Alternative entry point for running the server
"""
import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
