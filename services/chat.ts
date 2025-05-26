import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  ChatMessage,
  DetailedUserAgentModel,
  GetChatHistoryParams,
  GetChatHistoryResp,
  KolStatusResp,
  UserAgent,
  UserAgentModelResp,
  UserAgentResp
} from "~types/chat"

export const getChatHistory = async ({
  screenName,
  page,
  take
}: GetChatHistoryParams): Promise<GetChatHistoryResp> => {
  const response = await client.get(
    `/users/chat/${screenName}?page=${page}&take=${take}`
  )
  return response.data
}

export const useChatHistory = (
  screenName: string,
  take: number,
  enabled = false
) => {
  return useInfiniteQuery<GetChatHistoryResp, Error, InfiniteData<ChatMessage>>(
    {
      queryKey: ["user-chat-history", screenName, take],
      queryFn: ({ pageParam = 1 }) =>
        getChatHistory({ screenName, page: pageParam as number, take }),
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled,
      getNextPageParam: (lastPage) => {
        return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined
      },
      select: (data) => {
        return {
          pages: data.pages
            .map((page) => page.data)
            .flat()
            .reverse(),
          pageParams: data.pageParams
        }
      }
    }
  )
}

export const checkKolStatus = async (
  screenName: string
): Promise<KolStatusResp> => {
  const response = await client.get(`/users/check/kol/${screenName}`)
  return response.data
}

export const useCheckKolStatus = (screenName: string) => {
  return useQuery({
    retry: 0,
    refetchOnWindowFocus: false,
    queryKey: ["kol-status", screenName],
    queryFn: () => checkKolStatus(screenName)
  })
}

export const applyKol = async (screenName: string): Promise<KolStatusResp> => {
  const response = await client.post(`/users/apply/kol/${screenName}`)
  return response.data
}

export const useApplyKol = (
  options?: Partial<UseMutationOptions<KolStatusResp, Error, string>>
) => {
  return useMutation({
    ...options,
    mutationFn: applyKol
  })
}

export const getUserAgents = async (): Promise<UserAgentResp> => {
  const response = await client.get("/users/agents")
  return response.data
}

export const useGetUserAgents = () => {
  return useQuery({
    retry: 0,
    refetchOnWindowFocus: false,
    queryKey: ["user-agents"],
    queryFn: getUserAgents
  })
}

export const getUserAgentModels = async (
  id: string
): Promise<UserAgentModelResp> => {
  const response = await client.get(`/users/agents/${id}/models`)
  return response.data
}

export const useGetUserAgentModels = (id: string) => {
  return useQuery({
    retry: 0,
    refetchOnWindowFocus: false,
    queryKey: ["user-agent-models", id],
    queryFn: () => getUserAgentModels(id),
    enabled: !!id
  })
}
