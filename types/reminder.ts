export enum ReminderStatus {
  UPCOMING = "upcoming",
  PENDING = "pending",
  RECURRING = "recurring",
  PAST = "past",
  CANCEL = "cancel"
}
export interface ReminderItem {
  id: string
  title: string
  description: string
  fromAt: string
  toAt: string
  status: ReminderStatus
}

export type DialogReminderItem = Omit<ReminderItem, "id" | "status"> & {
  id?: string
  status?: string
}

export interface GetRemindersParmas {
  page: number
  take?: number
  keywords?: string
}

export interface GetRemindersResp {
  data: ReminderItem[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}

export interface FormatReminderItem {
  id: string
  items: ReminderItem[]
}

export interface CreateReminderParams {
  title: string
  description: string
  fromAt: string
  toAt: string
}

export interface UpdateReminderParam {
  data: CreateReminderParams
  id: string
}
