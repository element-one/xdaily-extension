import type { StateCreator } from "zustand"

import type { UserInfo } from "~types/user"

type UserState = {
  isAuthenticated: boolean
  userInfo: UserInfo | null
}

type UserActions = {
  updateUserInfo: (userInfo?: UserInfo | null) => void
  setIsAuthenticated: (isAuthenticated?: boolean) => void
  clearUserInfo: () => void
}

export type UserSlice = UserState & UserActions

const initialState: UserState = {
  isAuthenticated: false,
  userInfo: null
}

export const creatUserSlice: StateCreator<UserSlice> = (set) => ({
  ...initialState,
  updateUserInfo: (info?: UserInfo | null) => set({ userInfo: info }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  clearUserInfo: () => set(initialState)
})
