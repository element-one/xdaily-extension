import type { PartialBlock } from "@blocknote/core"

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
  id: string // user agent id
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

export enum ChatType {
  MEMO = "memo",
  SHEET = "sheet",
  REMINDER = "reminder"
}
export interface MemoMessageData extends BaseMessageData {
  type: ChatType.MEMO
  title: string
  content: PartialBlock[]
}

// Sheet type message data
export interface SheetMessageData extends BaseMessageData {
  type: ChatType.SHEET
  title: string
  content: string
}

// Reminder type message data
export interface ReminderMessageItem {
  title: string
  description: string
  start_at: string
  end_at: string
}
export interface ReminderMessageData extends BaseMessageData {
  type: ChatType.REMINDER
  content: ReminderMessageItem[]
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

export interface TopChatUser {
  chatAt: string
  threadId: string
  message: string
  user: {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string | null
    profileImageUrl: string
    referralCode: string
  }
  twitterUser: {
    avatar: string
    bio: string
    followers: number
    following: number
    id: string
    isClaimed: boolean
    isVerified: boolean
    joinedAt: Date
    kolStatus: KolStatus
    location: string
    name: string
    screenName: string
    userId: string
    tweets: number
    updatedAt: Date
    website: string | null
  }
}
