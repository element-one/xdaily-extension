import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query"

import client from "~libs/client"
import type { GetMemoListResp, GetMemoParams, MemoItem } from "~types/memo"

export const getMemoList = async ({
  page,
  take
}: GetMemoParams): Promise<GetMemoListResp> => {
  const response = await client.get(`/users/memos?page=${page}&take=${take}`)
  return response.data
}

export const useMemoList = (take: number) => {
  return useInfiniteQuery<GetMemoListResp, Error, InfiniteData<MemoItem>>({
    queryKey: ["memo-list", take],
    queryFn: ({ pageParam = 1 }) =>
      getMemoList({ page: pageParam as number, take }),
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
