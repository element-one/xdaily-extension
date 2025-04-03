import type { KolStatus } from "./enum"

export interface ChatMessage {
  // id: string
  message: string
  isBot: boolean
  chatAt: number
  // other is not important, so just omit
}

export interface ChatConversation {
  screenName: string
  messages: ChatMessage[]
}

export interface GetChatHistoryParams {
  screenName: string
  page: number
  take: number
}

export interface ChatHistory {}
export interface GetChatHistoryResp {
  data: ChatMessage[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}

export interface KolStatusResp {
  kolStatus: KolStatus
}
