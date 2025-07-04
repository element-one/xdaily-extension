export interface GetSheetListParams {
  page: number
  take: number
  keywords?: string
}

export interface SparseFormat {
  data: {
    row_index: number
    column_index: number
    payload: {
      content: string
      labels: string[]
    }
  }[]
  columns: {
    title: string
    id: string
    index: number
  }[]
}
export interface SheetItem {
  /**
   * JSON.stringify(SparseFormat)
   * or JSON.stringify({})
   */
  content: { item: string }
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
    /**
     * JSON.stringify(SparseFormat)
     * or JSON.stringify({})
     */
    item: string
  }
}

export interface UpdateSheetDataParam {
  data: PostSheetDataParam
  id: string
}
