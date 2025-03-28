import type { ToastProps } from "~contents/toast"

import type { TweetCollection, UserCollection } from "./collection"

export enum MessageType {
  CHECK_AUTH = "check_login",
  SIDE_PANEL_CLOSE_ITSELF = "sidepanel_close_self",
  INPAGE_TOAST = "show_toast_in_page",
  ADD_COLLECTION = "add_tweet_collection",
  ADD_USER_COLLECTION = "add_user_collection",
  REQUEST_TWEET_DETAILS = "request_tweet_detail_from_page"
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
