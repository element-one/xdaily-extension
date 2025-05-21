import type { StateCreator } from "zustand"

import type { TweetData } from "~types/tweet"

type ChatState = {
  quoteTweet: TweetData | null
  kolScreenName: string // to deside whether show KolChatSection or not
}

type ChatActions = {
  setQuoteTweet: (tweetData: TweetData) => void
  removeQuoteTweet: () => void
  setKolScreenName: (screenName: string) => void
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  quoteTweet: null,
  kolScreenName: ""
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setQuoteTweet: (tweetData: TweetData) => set({ quoteTweet: tweetData }),
  removeQuoteTweet: () =>
    set({
      quoteTweet: null
    }),
  setKolScreenName: (screenName: string) => {
    console.log("testing", screenName)
    return set({ kolScreenName: screenName })
  }
})
