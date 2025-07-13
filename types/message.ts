import type { ToastProps } from "~contents/toast"

import type { TweetCollection, UserCollection } from "./collection"
import type { TweetData } from "./tweet"

export enum MessageType {
  CHECK_AUTH = "check_login",
  SIDE_PANEL_CLOSE_ITSELF = "sidepanel_close_self",
  INPAGE_TOAST = "show_toast_in_page",
  ADD_COLLECTION = "add_tweet_collection",
  ADD_USER_COLLECTION = "add_user_collection",
  QUOTE_TWEET = "quote_tweet_to_chat_with_bot",
  CHAT_WITH_USER = "chat_with_user",
  LANGUAGE_CHANGED = "language_changed"
}

export type InpageToastPayload = {
  type: MessageType.INPAGE_TOAST
  message: ToastProps
}

export type AddTweetCollectionPayload = {
  type: MessageType.ADD_COLLECTION
  data: TweetCollection
}

export type AddUserCollectionPayload = {
  type: MessageType.ADD_USER_COLLECTION
  data: UserCollection
}

export type QuoteTweetPayload = {
  type: MessageType.QUOTE_TWEET
  data: TweetData
}

export type ChatWithUserPayload = {
  type: MessageType.CHAT_WITH_USER
  data: {
    kolScreenName: string
    kolAvatarUrl?: string
    kolUserName?: string
  }
}

export type LanguageChangedPayload = {
  type: MessageType.LANGUAGE_CHANGED
  language: string
}

export type MessagePayload =
  | InpageToastPayload
  | AddTweetCollectionPayload
  | AddUserCollectionPayload
  | QuoteTweetPayload
  | ChatWithUserPayload
  | LanguageChangedPayload
