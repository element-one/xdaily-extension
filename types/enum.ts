export const X_SITE = "https://x.com"

export enum NavbarItemKey {
  // POST = "post",
  // USER = "user",
  // SUGGESTION = "ai suggestions",
  // COLLECTION = "collection",
  // SETTING = "setting",
  // CHAT = "chat",
  // MEMO = "memo"
  EXPLORE = "explore",
  SETTING = "setting",
  KNOWLEDGE = "knowledge_base",
  MEMO = "memo",
  SHEET = "sheets",
  REMINDER = "reminder",
  ADD = "add",
  INVITE = "invite",
  CHAT = "self_robot_chat"
}

export enum UserPanelItemKey {
  LIST = "user_panel_list",
  CHAT = "user_panel_chat"
}

export enum ChatStatus {
  IDLE = "idle",
  STREAMING = "streaming",
  ERROR = "error"
}

export enum KolStatus {
  NONE = "none",
  APPLYING = "applying",
  APPROVED = "approved"
}
