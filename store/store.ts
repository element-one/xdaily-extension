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
import { createWidgetSlice, type WidgetSlice } from "./widgetSlice"

let isUpdatingFromStorage = false

const plasmoStorage = new Storage({
  area: "local"
})
// Custom storage object
const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await plasmoStorage.get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (isUpdatingFromStorage) {
      return
    }
    isUpdatingFromStorage = true
    await plasmoStorage.set(name, value)
    isUpdatingFromStorage = false
  },
  removeItem: async (name: string): Promise<void> => {
    await plasmoStorage.remove(name)
  }
}

type StoreState = UserSlice & WidgetSlice & NavigationSlice & ChatSlice

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createWidgetSlice(...a),
      ...createNavigationSlice(...a),
      ...createChatSlice(...a)
    }),
    {
      name: "mecoin-extension-storage",
      storage: createJSONStorage(() => customStorage)
    }
  )
)

plasmoStorage.watch({
  "mecoin-extension-storage": (change) => {
    const { oldValue, newValue } = change
    const newValueState = newValue ? JSON.parse(newValue)?.state ?? null : null
    if (newValue !== oldValue) {
      if (isUpdatingFromStorage) {
        return
      }
      // NOTE: do not set state as undefined, or it would not change anymore
      useStore.setState((state) => ({
        ...state,
        ...newValueState
      }))
    }
  }
})
