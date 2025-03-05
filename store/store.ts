import { create } from "zustand"
import {
  createJSONStorage,
  persist,
  type StateStorage
} from "zustand/middleware"

import { Storage } from "@plasmohq/storage"

import { creatUserSlice, type UserSlice } from "./userSlice"

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

type StoreState = UserSlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...creatUserSlice(...a)
    }),
    {
      name: "mecoin-extension-storage",
      storage: createJSONStorage(() => customStorage)
    }
  )
)
