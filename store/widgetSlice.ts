import type { StateCreator } from "zustand"

type WidgetState = {
  isHideGlobally: boolean
}

type WidgetAction = {
  onHideGloballyChange: (hide: boolean) => void
}

export type WidgetSlice = WidgetState & WidgetAction

const initialState: WidgetState = {
  isHideGlobally: false
}

export const createWidgetSlice: StateCreator<WidgetSlice> = (set) => ({
  ...initialState,
  onHideGloballyChange: (hide: boolean) => set({ isHideGlobally: hide })
})
