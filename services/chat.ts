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
  ChatModelInfo,
  GetChatHistoryParams,
  GetChatHistoryResp,
  KolStatusResp,
  TopChatUser,
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

export const getChatModelInfo = async (
  screenName: string
): Promise<ChatModelInfo> => {
  const response = await client.get(`/users/chat/agent/${screenName}`)
  return response.data
}

export const useGetChatModelInfo = (screenName: string) => {
  return useQuery({
    retry: 0,
    refetchOnWindowFocus: false,
    queryKey: ["user-chat-model-info", screenName],
    queryFn: () => getChatModelInfo(screenName),
    enabled: !!screenName
  })
}

export const updateChatModelInfo = async ({
  userAgentId,
  modelId
}: {
  userAgentId: string
  modelId: string
}): Promise<ChatModelInfo> => {
  const response = await client.put(`/users/chat/agent/${userAgentId}/model`, {
    modelId
  })
  return response.data
}

export const useUpdateChatModelInfo = (
  options?: Partial<
    UseMutationOptions<
      ChatModelInfo,
      Error,
      {
        userAgentId: string
        modelId: string
      }
    >
  >
) => {
  return useMutation({
    ...options,
    mutationKey: ["update-chat-info"],
    mutationFn: updateChatModelInfo
  })
}

export const getTopChatUsers = async (
  order = "desc"
): Promise<TopChatUser[]> => {
  const response = await client.get(`/users/chat/top-users?order=${order}`)
  return response.data?.data
}

export const useGetTopChatUsers = () => {
  return useQuery({
    retry: 0,
    refetchOnWindowFocus: false,
    queryKey: ["get-top-chat-users"],
    queryFn: () => getTopChatUsers()
  })
}
