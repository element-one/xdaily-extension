import type { StateCreator } from "zustand"

import type { TweetData } from "~types/tweet"

type ChatState = {
  quoteTweet: TweetData | null
  kolScreenName: string // to deside whether show KolChatSection or not
  kolAvatarUrl: string
}

type ChatActions = {
  setQuoteTweet: (tweetData: TweetData) => void
  removeQuoteTweet: () => void
  setKolScreenName: (screenName: string) => void
  setKolAvatarUrl: (url: string) => void
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  quoteTweet: null,
  kolScreenName: "",
  kolAvatarUrl: ""
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setQuoteTweet: (tweetData: TweetData) => set({ quoteTweet: tweetData }),
  removeQuoteTweet: () =>
    set({
      quoteTweet: null
    }),
  setKolScreenName: (screenName: string) => set({ kolScreenName: screenName }),
  setKolAvatarUrl: (url: string) => set({ kolAvatarUrl: url })
})
