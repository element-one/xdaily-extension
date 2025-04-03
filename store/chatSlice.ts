// ~store/chatSlice.ts
import type { StateCreator } from "zustand"

import type { ChatConversation, ChatMessage } from "~types/chat"
import { ChatStatus } from "~types/enum"

type ChatState = {
  currentScreenName: string | null
  conversations: ChatConversation[]
  status: ChatStatus
}

type ChatActions = {
  addMessage: (screenName: string, text: string, isUser: boolean) => void
  sendMessage: (screenName: string, text: string) => Promise<void>
  resetConversation: (screenName: string) => void
  setCurrentScreenName: (screenName: string | null) => void
  sendGreeting: (screenName: string) => Promise<void>
}

export type ChatSlice = ChatState & ChatActions

const initialState: ChatState = {
  currentScreenName: "",
  conversations: [],
  status: ChatStatus.IDLE
}

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  ...initialState,

  addMessage: (screenName, text, isUser) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      isUser,
      timestamp: Date.now()
    }

    set((state) => {
      const existingConvIndex = state.conversations.findIndex(
        (c) => c.screenName === screenName
      )

      if (existingConvIndex >= 0) {
        // update current conversation
        const updatedConversations = [...state.conversations]
        updatedConversations[existingConvIndex] = {
          ...updatedConversations[existingConvIndex],
          messages: [
            ...updatedConversations[existingConvIndex].messages,
            newMessage
          ]
        }

        return { conversations: updatedConversations }
      } else {
        // create new conversation
        return {
          conversations: [
            ...state.conversations,
            {
              screenName,
              messages: [newMessage]
            }
          ]
        }
      }
    })
  },

  sendMessage: async (screenName, text) => {
    const { addMessage } = get()

    // add user message
    addMessage(screenName, text, true)
    set({ status: ChatStatus.STREAMING })

    try {
      const response = await fetch(
        `${process.env.PLASMO_PUBLIC_SERVER_URL}/users/chat/${screenName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: text })
        }
      )

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
      }
      if (buffer) {
        addMessage(screenName, buffer, false)
      } else {
        throw new Error("no response")
      }
    } catch (error) {
      addMessage(screenName, "An error occurred. Please try again", false)
      set({ status: ChatStatus.ERROR })
    } finally {
      set({ status: ChatStatus.IDLE })
    }
  },

  resetConversation: (screenName) => {
    set((state) => ({
      conversations: state.conversations.filter(
        (c) => c.screenName !== screenName
      )
    }))
  },

  setCurrentScreenName: (screenName) => set({ currentScreenName: screenName }),
  sendGreeting: async (screenName) => {
    const { addMessage } = get()

    addMessage(screenName, "Hello! How can I help you today?", false)
  }
})
