import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query"

import client from "~libs/client"
import type {
  ChatMessage,
  GetChatHistoryParams,
  GetChatHistoryResp
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

export const useChatHistory = (screenName: string, take: number) => {
  return useInfiniteQuery<GetChatHistoryResp, Error, InfiniteData<ChatMessage>>(
    {
      queryKey: ["user-chat-history", screenName, take],
      queryFn: ({ pageParam = 1 }) =>
        getChatHistory({ screenName, page: pageParam as number, take }),
      initialPageParam: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
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
