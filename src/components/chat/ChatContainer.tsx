import { useEffect, useRef, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'

export const ChatContainer = () => {
  const { messages, isTyping, addMessage, setTyping } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages, isTyping])

  const handleSendMessage = useCallback((content: string) => {
    // Add user message
    addMessage(content, 'user')
    
    // Simulate bot typing
    setTyping(true)
    
    // Mock bot response after 1.5 seconds
    const timeoutId = setTimeout(() => {
      setTyping(false)
      addMessage(
        'This is a mock response. The backend is not connected yet.',
        'bot'
      )
    }, 1500)
    
    // Cleanup function
    return () => clearTimeout(timeoutId)
  }, [addMessage, setTyping])

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">ServicePilot Chat</h1>
        <p className="text-sm opacity-90">Your AI Assistant</p>
      </header>

      {/* Messages area */}
      <main 
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} aria-hidden="true" />
      </main>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}