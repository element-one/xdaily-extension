import { create } from "zustand"
import {
  createJSONStorage,
  persist,
  type StateStorage
} from "zustand/middleware"

import { Storage } from "@plasmohq/storage"

import { createChatSlice, type ChatSlice } from "./chatSlice"
import { createNavigationSlice, type NavigationSlice } from "./navigationSlice"
import { createUserSlice, type UserSlice } from "./userSlice"

const plasmoStorage = new Storage({
  area: "local"
})
// Custom storage object
const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await plasmoStorage.get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await plasmoStorage.set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await plasmoStorage.remove(name)
  }
}

type StoreState = UserSlice & NavigationSlice & ChatSlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createNavigationSlice(...a),
      ...createChatSlice(...a)
    }),
    {
      name: "xdaily-extension-storage",
      storage: createJSONStorage(() => customStorage)
    }
  )
)
