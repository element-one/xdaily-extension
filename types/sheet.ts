export interface GetSheetListParams {
  page: number
  take: number
  keywords?: string
}

export interface SheetItem {
  content: { item: string } // string or JSON string
  id: string
  postedAt: Date
  title: string
}
export interface GetSheetListResp {
  data: SheetItem[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}

export interface PostSheetDataParam {
  title: string
  content: {
    item: string // string or JSON string
  }
}
