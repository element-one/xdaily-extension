import type { PartialBlock } from "@blocknote/core"

export interface GetMemoParams {
  page: number
  take: number
  keywords?: string
}
export interface MemoItem {
  content: { document?: PartialBlock[] }
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

export interface PostMemoParams {
  title: string
  content: {
    document: PartialBlock[]
  }
}

export interface UpdateMemoParams {
  data: {
    title: string
    content: {
      document: PartialBlock[]
    }
  }
  id: string
}
