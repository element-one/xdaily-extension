import type { KolStatus } from "./enum"

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
  screenName: string
}
export interface GetTweetCollectionResp {
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

export interface GetUserCollectionParams {
  page: number
  take: number
}

export interface UserCollection {
  id: string
  userId: string
  name: string
  bio: string
  avatar: string
  followers: number
  following: number
  tweets: number
  location: string
  website: string
  joinedAt: Date
  isVerified: boolean
  updatedAt: Date
  screenName: string
  isClaimed: boolean
  kolStatus: KolStatus
}
export interface GetUserCollectionResp {
  data: UserCollection[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}

export interface GetKolCollectionParams {
  page: number
  take: number
  categoryId?: string
}
export interface KolCollection {
  id: string
  name: string
  screenName: string
  avatar: string
  bio?: string
  followers: number
  following: number
  tweets: number
  location?: string
  website?: string
  isKol: boolean
  isVerified: boolean
  userId: string
  joinedAt: Date
  updatedAt: Date
}

export interface GetKolCollectionResp {
  data: KolCollection[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}

export interface GetUserSearchParams {
  keywords: string
  take?: number
}

export interface GetUserSearchResp {
  people: UserCollection[]
  files: any[]
  channels: any[]
  text: any[]
}

export interface FileCollection {
  id: string
  fileUrl: string
  fileType: string
  content: any | null
  status: string // TODO enum
  createdAt: Date
}
export interface GetFileCollectionResp {
  data: FileCollection[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: number
    hasNextPage: number
  }
}
