export enum MessageType {
  SAVE_TWEET = "save_tweet",
  TOGGLE_PANEL = "toggle_side_panel",
  CHECK_AUTH = "check_login",
  SIDE_PANEL_CLOSE_ITSELF = "sidepanel_close_self",
  SUBSCRIBE_USER = "subscribe_tweet_user",
  INPAGE_TOAST = "show_toast_in_page"
}

export const USER_TOKEN = "authToken" as const
