import type { ToastProps } from "~contents/toast"

export enum ContentMessageType {
  CHECK_AUTH = "check_login",
  SIDE_PANEL_CLOSE_ITSELF = "sidepanel_close_self",
  INPAGE_TOAST = "show_toast_in_page",
  REFETCH_COLLECTION = "refetch_tweet_collection"
}

export type InpageToastPayload = {
  type: ContentMessageType.INPAGE_TOAST
  message: ToastProps
}

export enum BackgroundMessageType {
  SAVE_TWEET = "save_tweet",
  SUBSCRIBE_USER = "subscribe_tweet_user",
  TOGGLE_PANEL = "toggle_side_panel"
}

export type BackgroundMessagePayload =
  | { type: BackgroundMessageType.SAVE_TWEET; tweetId?: string }
  | { type: BackgroundMessageType.SUBSCRIBE_USER; userId?: string }
  | { type: BackgroundMessageType.TOGGLE_PANEL }
