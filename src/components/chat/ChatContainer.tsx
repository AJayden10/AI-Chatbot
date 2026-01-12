import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'

export const ChatContainer = () => {
  const { messages, isTyping, addMessage, setTyping } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage(content, 'user')
    setTyping(true)

    try {
      // Simulate bot response (replace with real API call later)
      setTimeout(() => {
        setTyping(false)
        addMessage(
          'This is a mock response. The backend is not connected yet.',
          'bot'
        )
      }, 1500)
    } catch (error) {
      console.error('Error sending message:', error)
      
      setTyping(false)
      addMessage(
        "Sorry, I'm having trouble connecting. Please try again.",
        'bot'
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">ServicePilot</h1>
            <p className="text-sm text-gray-500">AI Support Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}