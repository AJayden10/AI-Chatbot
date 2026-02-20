import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
