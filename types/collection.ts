export interface GetCollectionParams {
  page: number
  take: number
}

export interface TweetCollection {
  postedAt: Date
  tweetId: string
  content: string
  userId: string
  timestamp: string
  hashtags: string[]
}
export interface GetCollectionResp {
  data: TweetCollection[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}
