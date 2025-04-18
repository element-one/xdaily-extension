import type { StateCreator } from "zustand"

import type { TweetData } from "~types/tweet"

type ChatState = {
  quoteTweet: TweetData | null
}

type ChatActions = {
  setQuoteTweet: (tweetData: TweetData) => void
  removeQuoteTweet: () => void
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  quoteTweet: null
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setQuoteTweet: (tweetData: TweetData) => set({ quoteTweet: tweetData }),
  removeQuoteTweet: () => set(initialState)
})
