# ServicePilot Backend — Block 1

Quick start (development):

1. Create a virtualenv and install deps

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` (Postgres recommended)

3. Create tables:

```bash
python create_db.py
```

4. Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

5. Smoke test:

```bash
curl -X POST http://localhost:8000/api/message -H "Content-Type: application/json" -d "{\"session_id\":\"s1\",\"content\":\"Hello\"}"
```

This block includes:
- `POST /api/message` (accepts `session_id`, `content`) — stores messages, returns a simple reply and sentiment.
- In-memory `SessionManager` (replace with Redis for production).
- SQLAlchemy models for `users`, `conversations`, `messages`, `knowledge_base`.
