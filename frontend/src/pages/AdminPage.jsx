import { useState, useEffect } from 'react'
import {
  listConversations,
  getConversationMessages,
  getCustomizationSettings,
  updateCustomizationSettings,
} from '../services/api'
import { Search, MessageSquare, Calendar, Filter } from 'lucide-react'

export default function AdminPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [settings, setSettings] = useState({
    greeting_message: '',
    fallback_response: '',
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadConversations()
    loadSettings()
  }, [statusFilter])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const data = await listConversations(100, statusFilter || null)
      setConversations(data)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const data = await getCustomizationSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSelectConversation = async (sessionId) => {
    try {
      const data = await getConversationMessages(sessionId)
      setMessages(data.messages || [])
      setSelectedConversation(sessionId)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      await updateCustomizationSettings(settings)
      alert('Settings saved successfully!')
      setShowSettings(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.session_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Tools</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>

      {/* Customization Settings */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Customization Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Greeting Message
              </label>
              <textarea
                value={settings.greeting_message}
                onChange={(e) =>
                  setSettings({ ...settings, greeting_message: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fallback Response
              </label>
              <textarea
                value={settings.fallback_response}
                onChange={(e) =>
                  setSettings({ ...settings, fallback_response: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations found</div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.session_id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conv.session_id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {conv.session_id.substring(0, 8)}...
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            conv.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : conv.status === 'escalated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {conv.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(conv.started_at).toLocaleDateString()}
                        </span>
                        <span>{conv.message_count} messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Viewer */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Message Viewer</h2>
          </div>
          <div className="p-4 max-h-[600px] overflow-y-auto">
            {selectedConversation ? (
              messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.sentiment && (
                          <span className={`text-xs mt-1 block ${
                            msg.sentiment === 'positive' ? 'text-green-600' :
                            msg.sentiment === 'negative' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {msg.sentiment}
                          </span>
                        )}
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">No messages to display</div>
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
