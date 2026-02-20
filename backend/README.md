# ServicePilot Backend

FastAPI backend for ServicePilot AI Customer Service Platform.

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up PostgreSQL database:**
- Create a PostgreSQL database
- Update `DATABASE_URL` in `.env`
- Tables will be created automatically on first run

5. **Run the server:**
```bash
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Chat
- `POST /api/message` - Send a chat message
- `GET /api/conversations/{session_id}` - Get conversation messages

### Knowledge Base
- `GET /api/knowledge-base/` - List entries
- `POST /api/knowledge-base/` - Create entry
- `GET /api/knowledge-base/{id}` - Get entry
- `PUT /api/knowledge-base/{id}` - Update entry
- `DELETE /api/knowledge-base/{id}` - Delete entry

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/conversation-volume` - Get conversation volume
- `GET /api/analytics/sentiment-trends` - Get sentiment trends
- `GET /api/analytics/top-categories` - Get top categories

### Admin
- `GET /api/admin/conversations` - List all conversations
- `GET /api/admin/conversations/{session_id}/messages` - Get conversation messages
- `GET /api/admin/settings` - Get customization settings
- `PUT /api/admin/settings` - Update customization settings

## Database Schema

- `users` - Admin accounts
- `conversations` - Chat sessions
- `messages` - Individual messages with sentiment
- `knowledge_base` - FAQ and support content

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (default: 8000)
- `NEGATIVE_SENTIMENT_THRESHOLD` - Sentiment threshold for escalation (default: -0.5)
