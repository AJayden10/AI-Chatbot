import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chat API
export const sendMessage = async (sessionId, message) => {
  const response = await api.post('/api/message', {
    session_id: sessionId,
    message,
  })
  return response.data
}

export const getConversation = async (sessionId) => {
  const response = await api.get(`/api/conversations/${sessionId}`)
  return response.data
}

// Analytics API
export const getAnalyticsSummary = async (days = 30) => {
  const response = await api.get('/api/analytics/summary', {
    params: { days },
  })
  return response.data
}

export const getConversationVolume = async (days = 30) => {
  const response = await api.get('/api/analytics/conversation-volume', {
    params: { days },
  })
  return response.data
}

export const getSentimentTrends = async (days = 30) => {
  const response = await api.get('/api/analytics/sentiment-trends', {
    params: { days },
  })
  return response.data
}

export const getTopCategories = async (limit = 10) => {
  const response = await api.get('/api/analytics/top-categories', {
    params: { limit },
  })
  return response.data
}

// Knowledge Base API
export const getKnowledgeEntries = async (category = null, isActive = true) => {
  const response = await api.get('/api/knowledge-base/', {
    params: { category, is_active: isActive },
  })
  return response.data
}

export const createKnowledgeEntry = async (entry) => {
  const response = await api.post('/api/knowledge-base/', entry)
  return response.data
}

export const updateKnowledgeEntry = async (id, entry) => {
  const response = await api.put(`/api/knowledge-base/${id}`, entry)
  return response.data
}

export const deleteKnowledgeEntry = async (id) => {
  const response = await api.delete(`/api/knowledge-base/${id}`)
  return response.data
}

// Admin API
export const listConversations = async (limit = 50, status = null) => {
  const response = await api.get('/api/admin/conversations', {
    params: { limit, status },
  })
  return response.data
}

export const getConversationMessages = async (sessionId) => {
  const response = await api.get(`/api/admin/conversations/${sessionId}/messages`)
  return response.data
}

export const getCustomizationSettings = async () => {
  const response = await api.get('/api/admin/settings')
  return response.data
}

export const updateCustomizationSettings = async (settings) => {
  const response = await api.put('/api/admin/settings', settings)
  return response.data
}
