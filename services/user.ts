import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import type { UserInfo } from "~/types/user"
import client from "~libs/client"

export const getUser = async (): Promise<UserInfo> => {
  const response = await client.get<{
    user: UserInfo
  }>("/users/me")
  return response.data.user
}

export const useUser = (
  options?: Partial<UseQueryOptions<UserInfo, Error, UserInfo>>
) => {
  return useQuery({
    ...options,
    queryKey: ["user"],
    queryFn: getUser
  })
}

export const updateUserLang = async (langCode: "en" | "zh") => {
  const response = await client.post("/users/update-lang", { langCode })
  return response.data
}
