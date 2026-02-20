import { useState, useEffect, useRef } from 'react'
import { sendMessage } from '../services/api'
import { MessageCircle, Send, Loader2 } from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to UI
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      const response = await sendMessage(sessionId, userMessage)
      
      // Update session ID if this is first message
      if (!sessionId) {
        setSessionId(response.session_id)
      }

      // Add assistant response to UI
      const assistantMessage = {
        role: 'assistant',
        content: response.reply,
        sentiment: response.sentiment,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Show escalation alert if needed
      if (response.escalated) {
        alert('⚠️ This conversation has been escalated due to negative sentiment. A human agent will be notified.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Chat Assistant</h2>
        <p className="text-sm text-gray-500">Ask me anything about your account, orders, or products</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-16 h-16 mb-4" />
            <p className="text-lg">Start a conversation</p>
            <p className="text-sm">Ask me anything and I'll help you out!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
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
                    Sentiment: {msg.sentiment}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
