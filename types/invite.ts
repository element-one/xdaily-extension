export interface GetInviteCodeResp {
  url: string
}
export interface GetInviteHistoryParams {
  page: number
  take: number
}

export interface HistoryItem {
  id: string
  referral: {
    firstName: string
    lastName: string
    email: string
  }
}

export interface GetInviteHistoryResp {
  data: HistoryItem[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}
