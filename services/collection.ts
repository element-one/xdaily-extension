import {
  useInfiniteQuery,
  useMutation,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  FileCollection,
  GetCollectionParams,
  GetFileCollectionResp,
  GetKnowledgeBaseCollectionParams,
  GetKolCollectionParams,
  GetKolCollectionResp,
  GetTweetCollectionResp,
  GetUserCollectionParams,
  GetUserCollectionResp,
  GetUserSearchParams,
  GetUserSearchResp,
  KolCollection,
  TweetCollection,
  UserCollection
} from "~types/collection"

export const getTweetCollection = async ({
  page,
  take
}: GetCollectionParams): Promise<GetTweetCollectionResp> => {
  const response = await client.get(`/users/tweets?page=${page}&take=${take}`)
  return response.data
}

export const useTweetCollections = (take: number) => {
  return useInfiniteQuery<
    GetTweetCollectionResp,
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

export const getUserCollection = async ({
  page,
  take
}: GetUserCollectionParams): Promise<GetUserCollectionResp> => {
  const response = await client.get(`/users/follows?page=${page}&take=${take}`)
  return response.data
}

export const useUserCollections = (take: number) => {
  return useInfiniteQuery<
    GetUserCollectionResp,
    Error,
    InfiniteData<UserCollection>
  >({
    queryKey: ["user-collections", take],
    queryFn: ({ pageParam = 1 }) =>
      getUserCollection({ page: pageParam as number, take }),
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

export const getKolCollection = async ({
  page,
  take,
  categoryId
}: GetKolCollectionParams): Promise<GetKolCollectionResp> => {
  let reqUrl = `/users/categories/kol?page=${page}&take=${take}`
  if (categoryId) {
    reqUrl = `reqUrl&categoryId=${categoryId}`
  }
  const response = await client.get(reqUrl)
  return response.data
}

export const useKolCollections = (take: number, categoryId?: string) => {
  return useInfiniteQuery<
    GetKolCollectionResp,
    Error,
    InfiniteData<KolCollection>
  >({
    queryKey: ["kol-collections", take],
    queryFn: ({ pageParam = 1 }) =>
      getKolCollection({ page: pageParam as number, take, categoryId }),
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

export const getSearchExplore = async ({
  keywords,
  take
}: GetUserSearchParams): Promise<GetUserSearchResp> => {
  let reqUrl = `/users/search?keywords=${keywords}`
  if (take) {
    reqUrl += `&take=${take}`
  }
  const response = await client.get(reqUrl)
  return response.data
}

export const userSearchExplore = (
  options?: Partial<
    UseMutationOptions<GetUserSearchResp, Error, GetUserSearchParams>
  >
) => {
  return useMutation({
    ...options,
    mutationKey: ["search-explore"],
    mutationFn: getSearchExplore
  })
}

export const getKnowledgeBaseCollections = async ({
  page,
  take,
  isSelected,
  notEqualsType,
  equalsType
}: GetKnowledgeBaseCollectionParams): Promise<GetFileCollectionResp> => {
  let url = `/users/knowledge-bases?page=${page}&take=${take}&isSelected]${!!isSelected}`
  if (notEqualsType) {
    url += `&notEqualsType=${notEqualsType}`
  }
  if (equalsType) {
    url += `&equalsType=${equalsType}`
  }

  const response = await client.get(url)
  return response.data
}

export const useKnowledgeBaseCollections = (
  params: Omit<GetKnowledgeBaseCollectionParams, "page">
) => {
  return useInfiniteQuery<
    GetFileCollectionResp,
    Error,
    InfiniteData<FileCollection>
  >({
    queryKey: [
      "knowledge-collections",
      params.take,
      params.equalsType,
      params.notEqualsType
    ],
    queryFn: ({ pageParam = 1 }) =>
      getKnowledgeBaseCollections({ page: pageParam as number, ...params }),
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
