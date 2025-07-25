import type { StateCreator } from "zustand"

import type { TweetData } from "~types/tweet"

type ChatState = {
  quoteTweet: TweetData | null
  kolScreenName: string // to deside whether show KolChatSection or not
  kolInfo: { avatarUrl: string; userName: string }
}

type ChatActions = {
  setQuoteTweet: (tweetData: TweetData) => void
  removeQuoteTweet: () => void
  setKolScreenName: (screenName: string) => void
  setKolInfo: (info: { avatarUrl: string; userName: string }) => void
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  quoteTweet: null,
  kolScreenName: "",
  kolInfo: {
    avatarUrl: "",
    userName: ""
  }
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setQuoteTweet: (tweetData: TweetData) => set({ quoteTweet: tweetData }),
  removeQuoteTweet: () =>
    set({
      quoteTweet: null
    }),
  setKolScreenName: (screenName: string) => set({ kolScreenName: screenName }),
  setKolInfo: (info: { avatarUrl: string; userName: string }) =>
    set({
      kolInfo: {
        avatarUrl: info.avatarUrl,
        userName: info.userName
      }
    })
})
