import type { StateCreator } from "zustand"

import { NavbarItemKey } from "~types/enum"

type NavigationState = {
  navbarItemKey: NavbarItemKey
}

type NavigationActions = {
  setNavbarItemKey: (key: NavbarItemKey) => void
  clearNavbar: () => void
}

export type NavigationSlice = NavigationState & NavigationActions

const initialState: NavigationState = {
  navbarItemKey: NavbarItemKey.POST
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  ...initialState,
  setNavbarItemKey: (key: NavbarItemKey) => set({ navbarItemKey: key }),
  clearNavbar: () => set(initialState)
})
