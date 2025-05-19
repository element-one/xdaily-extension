export interface ReminderItem {
  id: string
  date: Date
}

export enum ReminderStatus {
  UPCOMING = "upcoming",
  PENDING = "pending",
  RECURRING = "recurring",
  PAST = "past",
  CANCEL = "cancel"
}
export interface ReminderDetailItem {
  timeSpan: string
  status: ReminderStatus
  title: string
  info: string
}
