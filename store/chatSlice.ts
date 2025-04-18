import type { StateCreator } from "zustand"

type ChatState = {
  chatTweetId: string
}

type ChatActions = {
  setChatTweetId: (id: string) => void
  clearChatTweetId: () => void
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  chatTweetId: ""
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setChatTweetId: (id: string) => set({ chatTweetId: id }),
  clearChatTweetId: () => set(initialState)
})
