import type { KolStatus } from "./enum"

export interface ChatMessage {
  // id: string
  message: string
  isBot: boolean
  chatAt: number
  tweet?: {
    content: string
    hashtags: string[]
    timestamp: string
    tweetId: string
    userId: string
    id: string
    twitterUser: {
      id: string
      userId: string
      screenName: string
      name: string
      bio: string
      avatar: string
      followers: number
      following: number
      tweets: number
      location: string
    }
  }
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

export interface UserAgentModel {
  id: string
  name: string
  description: string | null
  createdAt: string
}
export interface UserAgentTool {
  id: string
  name: string
  description: string | null
  createdAt: string
}
export interface UserAgent {
  id: string
  name: string
  instructions: string
  description: string | null
  createdAt: string
  models: UserAgentModel[]
  tools: UserAgentTool[]
}

export interface UserAgentResp {
  data: UserAgent[]
}

export interface DetailedUserAgentModel {
  id: string
  name: string
  provider: string
  description: string | null
  iconUrl: string | null
  screenName: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export interface UserAgentModelResp {
  data: DetailedUserAgentModel[]
}

export interface ChatModelInfo {
  agent: {
    id: string
    name: string
    instructions: string
    description?: string | null
    createdAt: string
  }
  model: {
    id: string
    name: string
    screenName: string
    provider: string
    iconUrl: string | null
    creattedAt: string
  }
  isSelf: boolean
}

export interface BaseMessageData {
  type?: string
  title?: string
  error?: string
}

// Memo type message data
export interface ChatMemoContent {
  type: string
  content: string
}
export interface MemoMessageData extends BaseMessageData {
  type: "memo"
  title: string
  content: ChatMemoContent[]
}

// Sheet type message data
export interface SheetMessageData extends BaseMessageData {
  type: "sheet"
  title: string
  content: string
}

// Reminder type message data
export interface ReminderMessageData extends BaseMessageData {
  type: "reminder"
}

// Error message data
export interface ErrorMessageData extends BaseMessageData {
  error: string
}

export type ChatMessageData =
  | MemoMessageData
  | SheetMessageData
  | ReminderMessageData
  | ErrorMessageData
