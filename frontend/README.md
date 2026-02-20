# ServicePilot Frontend

React + Vite frontend for ServicePilot AI Customer Service Platform.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## Features

- **Chat Interface** - Interactive AI chat with sentiment analysis
- **Analytics Dashboard** - Charts and metrics visualization
- **Knowledge Base Management** - CRUD operations for FAQ entries
- **Admin Tools** - Conversation history and customization settings

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts (for charts)
- Axios (for API calls)
- React Router (for navigation)

## Project Structure

```
src/
  components/     # Reusable components
  pages/          # Page components
  services/       # API service functions
  App.jsx         # Main app component
  main.jsx        # Entry point
```
