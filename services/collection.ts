import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query"

import client from "~libs/client"
import type {
  GetCollectionParams,
  GetCollectionResp,
  TweetCollection
} from "~types/collection"

export const getTweetCollection = async ({
  page,
  take
}: GetCollectionParams): Promise<GetCollectionResp> => {
  const response = await client.get(`/users/tweets?page=${page}&take=${take}`)
  return response.data
}

export const useTweetCollections = (take: number) => {
  return useInfiniteQuery<
    GetCollectionResp,
    Error,
    InfiniteData<TweetCollection>
  >({
    queryKey: ["tweet-collections", take],
    queryFn: ({ pageParam = 1 }) =>
      getTweetCollection({ page: pageParam as number, take }),
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
