# ServicePilot Project Structure

```
AI-Chatbot/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration settings
│   │   ├── database.py        # Database connection & session
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── session_manager.py # Conversation session management
│   │   ├── routers/           # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── chat.py        # Chat endpoints
│   │   │   ├── knowledge_base.py # KB CRUD endpoints
│   │   │   ├── analytics.py   # Analytics endpoints
│   │   │   └── admin.py       # Admin endpoints
│   │   └── services/          # Business logic services
│   │       ├── __init__.py
│   │       ├── ai_service.py  # OpenAI integration
│   │       ├── sentiment_service.py # VADER sentiment analysis
│   │       └── knowledge_service.py # KB retrieval logic
│   ├── main.py                # FastAPI app entry point
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── README.md             # Backend documentation
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Layout.jsx    # Main layout with navigation
│   │   ├── pages/            # Page components
│   │   │   ├── ChatPage.jsx  # Chat interface
│   │   │   ├── DashboardPage.jsx # Analytics dashboard
│   │   │   ├── AdminPage.jsx # Admin tools
│   │   │   └── KnowledgeBasePage.jsx # KB management
│   │   ├── services/         # API service functions
│   │   │   └── api.js        # Axios API client
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── .env.example          # Environment variables template
│   └── README.md             # Frontend documentation
│
├── README.md                  # Main project README
├── DEPLOYMENT.md             # Deployment guide
├── PROJECT_STRUCTURE.md       # This file
└── .gitignore                # Git ignore rules
```

## Key Components

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Database via SQLAlchemy ORM
- **OpenAI API**: GPT integration for chat responses
- **VADER**: Sentiment analysis library
- **Session Management**: Conversation tracking

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **React Router**: Navigation
- **Axios**: HTTP client

## Development Workflow

1. **Backend**: Start FastAPI server (`python main.py`)
2. **Frontend**: Start Vite dev server (`npm run dev`)
3. **Database**: PostgreSQL must be running and configured
4. **API Keys**: OpenAI API key required for chat functionality
