export interface GetMemoParams {
  page: number
  take: number
}
export interface MemoItem {
  content: { item: string } // string or JSON string
  id: string
  postedAt: Date
  title: string
}
export interface GetMemoListResp {
  data: MemoItem[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}
