# **ServicePilot — AI-Powered Customer Service Automation**

ServicePilot is an AI-driven customer support automation platform that handles repetitive queries, analyzes customer sentiment in real time, and delivers instant, 24/7 responses. Designed for scalability and efficiency, ServicePilot helps businesses reduce support costs while improving customer satisfaction and operational insight.

---

## 🚀 **Features**

### 🤖 **AI Chatbot**

* Context-aware, multi-turn conversations
* Instant answers to FAQs, order lookups, account questions
* Learns from a customizable knowledge base

### 😊 **Sentiment Analysis**

* Detects emotional tone (positive, neutral, negative)
* Identifies frustrated customers for human escalation
* Visualizes sentiment trends over time

### 📊 **Analytics Dashboard**

* Conversation metrics (response time, resolutions, volume)
* Sentiment distribution & emotional patterns
* Query category breakdowns
* Performance insights to improve service quality

### 🛠️ **Admin Tools**

* Manage knowledge base entries
* Review full conversation history
* Configure escalation rules
* Customize system prompts, greetings, fallback behavior

---

## 🎯 **Why ServicePilot?**

Modern support teams face overwhelming volumes of repetitive questions, slow response times, high operational costs, and limited visibility into customer emotions. ServicePilot solves these challenges through automation, analytics, and AI-powered insights—helping businesses operate smarter, faster, and more efficiently.

---

## 🏗️ **Architecture Overview**

```
Frontend (React + Vite + Tailwind)
        |
        | REST API
        v
Backend (FastAPI + Python)
        |
        v
Database (PostgreSQL)
        |
        v
AI Services (OpenAI GPT + VADER Sentiment)
```

---

## 🧠 **Tech Stack**

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Frontend           | React 18, Vite, Tailwind CSS, Recharts     |
| Backend            | FastAPI, Python 3.9+                       |
| Database           | PostgreSQL (SQLAlchemy ORM)                |
| AI/LLM             | OpenAI GPT-3.5-turbo                       |
| Sentiment Analysis | VADER Sentiment Analyzer                   |
| Hosting            | Vercel (frontend), Railway/Render (backend) |

---

## 🛠️ **Installation & Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/servicepilot.git
cd servicepilot
```

---

## 🖥️ **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Environment variables (create a `.env` file):

```
VITE_API_URL=http://localhost:8000
```

---

## 🧩 **Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend `.env` variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/servicepilot
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret_key
PORT=8000
```

**Quick Start**: See `QUICKSTART.md` for detailed setup instructions.

---

## 🗄️ **Database Schema (Simplified)**

### Tables

* `users` — admin accounts
* `conversations` — each chat session
* `messages` — user + bot messages
* `knowledge_base` — FAQ and context entries

---

## 🧪 **Using the API**

### Example: Send Chat Message

```http
POST /api/message
Content-Type: application/json

{
  "session_id": null,
  "message": "Where is my order?"
}
```

### Response

```json
{
  "reply": "Your order #4382 is currently in transit and expected to arrive tomorrow!",
  "session_id": "uuid-here",
  "sentiment": "neutral",
  "sentiment_score": 0.0,
  "escalated": false
}
```

**API Documentation**: Once running, visit `http://localhost:8000/docs` for interactive API documentation.

---

## 📊 **Dashboard Preview**

*(Replace with real screenshots once available)*

```
📈 Sentiment Distribution
📊 Top Query Categories
🕒 Average Response Time
```

Add screenshot placeholders:

```
/assets/dashboard-overview.png  
/assets/sentiment-chart.png  
/assets/chat-interface.png  
```

---

## 🎓 **Learning Outcomes**

By building ServicePilot, you gain hands-on experience with:

* Full-stack development
* LLM integration & prompt engineering
* NLP and sentiment modeling
* Data visualization and dashboards
* Real-world API design
* End-to-end product development

---

## 🔮 **Future Roadmap**

* 🌍 Multi-language support
* 🔊 Voice-enabled interactions
* 🤖 Platform integrations (Slack, WhatsApp, Discord)
* 📈 Predictive analytics
* 🧠 Fine-tuned company-specific models
* 📬 CRM integrations

---

## ✨ **Project Success Criteria**

This project is considered successful if it includes:

* ✔️ Functional chatbot with accurate responses
* ✔️ Real-time sentiment analysis (>80% accuracy)
* ✔️ Analytics dashboard with key metrics
* ✔️ Admin panel for knowledge base & settings
* ✔️ Clean, deployable codebase
* ✔️ Clear documentation (this README)
* ✔️ Demo video for portfolio

---

## 🧑‍💻 **Contributing**

Contributions, issues, and feature requests are welcome!
Open a PR or submit an issue to get started.

---

## 📄 **License**

MIT License. Feel free to use and adapt for your own learning or business use.

---

## ⭐ **Show Your Support**

If you like this project, give it a **star** on GitHub to help it grow! ⭐

Just let me know!
