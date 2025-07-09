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
  navbarItemKey: NavbarItemKey.EXPLORE
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  ...initialState,
  setNavbarItemKey: (key: NavbarItemKey) =>
    set((state) => (state.navbarItemKey === key ? {} : { navbarItemKey: key })),
  clearNavbar: () => set(initialState)
})
