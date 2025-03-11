import type { StateCreator } from "zustand"

type WidgetState = {
  isHideGlobally: boolean
  disableSite: string[]
}

type WidgetAction = {
  onHideGloballyChange: (hide: boolean) => void
  addDisableSite: (site: string) => void
  removeFromDisableSite: (site: string) => void
}

export type WidgetSlice = WidgetState & WidgetAction

const initialState: WidgetState = {
  isHideGlobally: false,
  disableSite: []
}

export const createWidgetSlice: StateCreator<WidgetSlice> = (set) => ({
  ...initialState,
  onHideGloballyChange: (hide: boolean) => set({ isHideGlobally: hide }),
  addDisableSite: (site: string) =>
    set((state) => ({
      disableSite: Array.from(new Set([...state.disableSite, site]))
    })),
  removeFromDisableSite: (site: string) =>
    set((state) => ({
      disableSite: state.disableSite.filter((s) => s !== site)
    }))
})
