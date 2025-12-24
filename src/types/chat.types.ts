export interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  addMessage: (content: string, sender: 'user' | 'bot') => void
  setTyping: (isTyping: boolean) => void
}