export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: number
}

export interface ChatConversation {
  screenName: string
  messages: ChatMessage[]
}
