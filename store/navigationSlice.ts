import type { StateCreator } from "zustand"

import { NavbarItemKey, UserPanelItemKey } from "~types/enum"

type NavigationState = {
  navbarItemKey: NavbarItemKey
  userPanelItemKey: UserPanelItemKey
}

type NavigationActions = {
  setNavbarItemKey: (key: NavbarItemKey) => void
  setUserPanelItemKey: (key: UserPanelItemKey) => void
  clearNavbar: () => void
}

export type NavigationSlice = NavigationState & NavigationActions

const initialState: NavigationState = {
  navbarItemKey: NavbarItemKey.POST,
  userPanelItemKey: UserPanelItemKey.LIST
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  ...initialState,
  setNavbarItemKey: (key: NavbarItemKey) => set({ navbarItemKey: key }),
  setUserPanelItemKey: (key: UserPanelItemKey) =>
    set({ userPanelItemKey: key }),
  clearNavbar: () => set(initialState)
})
