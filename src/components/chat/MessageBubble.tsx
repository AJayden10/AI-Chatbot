import type { Message } from '@/types/chat.types'
import { format } from 'date-fns'
import { User, Bot } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user'
  const time = format(message.timestamp, 'HH:mm')
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-700'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">{time}</span>
      </div>
    </div>
  )
}