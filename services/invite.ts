import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type UseQueryOptions
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  GetInviteCodeResp,
  GetInviteHistoryParams,
  GetInviteHistoryResp,
  HistoryItem
} from "~types/invite"

export const getInviteCode = async (): Promise<GetInviteCodeResp> => {
  const response = await client.get("/users/invite-code")
  return response.data
}

export const useInviteCode = (
  options?: Partial<
    UseQueryOptions<GetInviteCodeResp, Error, GetInviteCodeResp>
  >
) => {
  return useQuery({
    ...options,
    queryKey: ["invite-code"],
    queryFn: getInviteCode
  })
}

export const getInviteHistory = async (): Promise<GetInviteHistoryResp> => {
  const response = await client.get("/users/invite-history")
  return response.data
}
export const useInviteHistory = (
  options?: Partial<
    UseQueryOptions<GetInviteHistoryResp, Error, GetInviteHistoryResp>
  >
) => {
  return useQuery({
    ...options,
    queryKey: ["invite-history"],
    queryFn: getInviteHistory
  })
}

export const getInviteHistoryPage = async ({
  page,
  take
}: GetInviteHistoryParams): Promise<GetInviteHistoryResp> => {
  const response = await client.get(
    `/users/invite-history?page=${page}&take=${take}`
  )
  return response.data
}

export const useInviteHistoryPage = (take: number) => {
  return useInfiniteQuery<
    GetInviteHistoryResp,
    Error,
    InfiniteData<HistoryItem>
  >({
    queryKey: ["invite-history-page", take],
    queryFn: ({ pageParam = 1 }) =>
      getInviteHistoryPage({ page: pageParam as number, take }),
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined
    },
    select: (data) => ({
      pages: data.pages.map((page) => page.data).flat(),
      pageParams: data.pageParams
    })
  })
}
