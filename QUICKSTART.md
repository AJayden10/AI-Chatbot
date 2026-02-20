# ServicePilot Quick Start Guide

Get ServicePilot up and running in minutes!

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ and npm installed
- PostgreSQL database (local or cloud)
- OpenAI API key

## Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your:
# - DATABASE_URL (PostgreSQL connection string)
# - OPENAI_API_KEY (your OpenAI API key)

# Run the server
python main.py
```

Backend will run on `http://localhost:8000`

## Step 2: Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set:
# VITE_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Step 3: Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE servicepilot;
   ```

2. Update `DATABASE_URL` in `backend/.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/servicepilot
   ```

3. Tables will be created automatically on first backend startup

## Step 4: Test the Application

1. **Open the frontend**: `http://localhost:5173`
2. **Test Chat**: Send a message in the chat interface
3. **Add Knowledge Base Entry**: Go to Knowledge Base page and add an FAQ
4. **View Dashboard**: Check analytics on the Dashboard page
5. **Admin Tools**: View conversation history in Admin page

## API Testing

Test the backend API directly:

```bash
# Health check
curl http://localhost:8000/health

# Send a chat message
curl -X POST http://localhost:8000/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me?"}'
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Ensure all dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in `backend/main.py`

### Database connection errors
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

## Next Steps

1. Add knowledge base entries via the UI
2. Customize greeting and fallback messages in Admin settings
3. Test sentiment analysis with various messages
4. Explore the analytics dashboard
5. Review conversation history

## Production Deployment

See `DEPLOYMENT.md` for production deployment instructions.
