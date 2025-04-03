import type { StateCreator } from "zustand"

import { BookmarkItemKey, NavbarItemKey } from "~types/enum"

type NavigationState = {
  navbarItemKey: NavbarItemKey
  bookmarkKey: BookmarkItemKey
}

type NavigationActions = {
  setNavbarItemKey: (key: NavbarItemKey) => void
  setBookmarkKey: (key: BookmarkItemKey) => void
  clearNavbar: () => void
}

export type NavigationSlice = NavigationState & NavigationActions

const initialState: NavigationState = {
  navbarItemKey: NavbarItemKey.BOOKMARK,
  bookmarkKey: BookmarkItemKey.TWEET
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  ...initialState,
  setNavbarItemKey: (key: NavbarItemKey) => set({ navbarItemKey: key }),
  setBookmarkKey: (key: BookmarkItemKey) => set({ bookmarkKey: key }),
  clearNavbar: () => set(initialState)
})
