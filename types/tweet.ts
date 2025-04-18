export interface CollectTweetParams {
  tweetId: string
}

export interface SubscribeTweetUserParams {
  tweetUserId: string
}

export interface SubscribeTweetUserResp {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: null
  subscribedAt: Date
  tweetUserId: string
}

export interface TweetDetailPageData {
  username: string
  tweetId: string
  content: string
  avatar: string
  url: string
}

export interface TweetData {
  tweetId: string
  avatarUrl?: string
  displayName: string
  username: string
  tweetText: string
  timestamp: string
}
