# ServicePilot Deployment Guide

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create a new Web Service:**
   - Connect your GitHub repository
   - Select the `backend` directory as root
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Set up PostgreSQL:**
   - Create a PostgreSQL database on Render
   - Copy the internal database URL
   - Add as `DATABASE_URL` environment variable

3. **Environment Variables:**
   ```
   DATABASE_URL=<your_postgres_url>
   OPENAI_API_KEY=<your_openai_key>
   PORT=8000
   ```

### Option 2: Railway

1. **Create a new project**
2. **Add PostgreSQL service**
3. **Add Python service:**
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Link PostgreSQL and set environment variables**

## Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables:**
   - `VITE_API_URL` - Your backend API URL

4. **Build settings:**
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

## Database Setup

1. **Create PostgreSQL database** (Render/Railway/Supabase)
2. **Update DATABASE_URL** in backend environment variables
3. **Tables are created automatically** on first API startup

## Environment Variables Checklist

### Backend
- [ ] `DATABASE_URL`
- [ ] `OPENAI_API_KEY`
- [ ] `PORT` (usually auto-set by platform)
- [ ] `JWT_SECRET` (for future auth)
- [ ] `NEGATIVE_SENTIMENT_THRESHOLD`

### Frontend
- [ ] `VITE_API_URL`

## Post-Deployment

1. **Test API endpoints:**
   ```bash
   curl https://your-api-url.com/health
   ```

2. **Add initial knowledge base entries** via admin panel

3. **Test chat functionality**

4. **Monitor logs** for errors

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check PostgreSQL service is running
- Ensure database exists

### CORS Issues
- Update `allow_origins` in `backend/main.py` with frontend URL

### API Key Issues
- Verify OpenAI API key is valid
- Check API key has sufficient credits
