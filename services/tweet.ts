import client from "~libs/client"
import type { CollectTweetParams, SubscribeTweetUserParams } from "~types/tweet"

export const collectTweet = async (params: CollectTweetParams) => {
  const response = await client.post(`/users/tweet/${params.tweetId}`)
  return response.data
}

export const subscribeTweetUser = async (params: SubscribeTweetUserParams) => {
  const response = await client.post(`/users/subscribe/${params.tweetUserId}`)
  return response.data
}
