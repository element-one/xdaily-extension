import { create } from "zustand"
import {
  createJSONStorage,
  persist,
  type StateStorage
} from "zustand/middleware"

import { Storage } from "@plasmohq/storage"

import { createUserSlice, type UserSlice } from "./userSlice"
import { createWidgetSlice, type WidgetSlice } from "./widgetSlice"

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

type StoreState = UserSlice & WidgetSlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createWidgetSlice(...a)
    }),
    {
      name: "mecoin-extension-storage",
      storage: createJSONStorage(() => customStorage)
    }
  )
)
