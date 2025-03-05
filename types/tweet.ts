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
