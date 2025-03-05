// import { create } from "zustand"
// import { persist, createJSONStorage } from "zustand/middleware"

// import { getUser } from "~services/user"
// import type { UserInfo } from "~types/user"

// interface UserState {
//   userInfo: UserInfo | null
//   isAuthenticated: boolean
//   setUser: (user: UserInfo | null) => void
//   getUserInfo: () => Promise<UserInfo | null>
//   clearUser: () => void
// }

// export const useUserStore = create<UserState>()(
//   persist(
//     (set, get) => ({
//       userInfo: null,
//       isAuthenticated: false,
//       setUser: (user) => {
//         set({ userInfo: user, isAuthenticated: !!user?.id })
//       },
//       getUserInfo: async () => {
//         if (get().userInfo) return get().userInfo

//         try {
//           const userData = await getUser()
//           set({ userInfo: userData, isAuthenticated: !!userData?.id })
//           return userData
//         } catch {
//           set({ userInfo: null, isAuthenticated: false })
//           return null
//         }
//       },
//       clearUser: () => {
//         set({ userInfo: null, isAuthenticated: false })
//       }
//     }),
//     {
//       name: "user-store",
//     //   storage: createJSONStorage(() => chrome.storage.local)
//     }
//   )
// )
