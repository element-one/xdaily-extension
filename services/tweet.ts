import client from "~libs/client"
import type { TweetCollection } from "~types/collection"
import type { CollectTweetParams, SubscribeTweetUserParams } from "~types/tweet"

export const collectTweet = async (
  params: CollectTweetParams
): Promise<TweetCollection> => {
  const response = await client.post(`/users/tweet/${params.tweetId}`)
  return response.data
}

export const subscribeTweetUser = async (params: SubscribeTweetUserParams) => {
  const response = await client.post(`/users/follow/${params.tweetUserId}`)
  return response.data
}
