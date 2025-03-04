import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import type { UserInfo } from "~/types/user"
import client from "~libs/client"

export const getUser = async (): Promise<UserInfo> => {
  const response = await client.get<{
    user: UserInfo
  }>("/users/me", {
    skipErrorHandler: true
  })
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
