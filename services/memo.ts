import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  GetMemoListResp,
  GetMemoParams,
  MemoItem,
  PostMemoParams,
  UpdateMemoParams
} from "~types/memo"

export const getMemoList = async ({
  page,
  take,
  keywords
}: GetMemoParams): Promise<GetMemoListResp> => {
  let url = `/users/memos?page=${page}&take=${take}`
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`
  }
  const response = await client.get(url)
  return response.data
}

export const useMemoList = (take: number, keywords?: string) => {
  const queryClient = useQueryClient()

  const infiniteQuery = useInfiniteQuery<
    GetMemoListResp,
    Error,
    InfiniteData<MemoItem>
  >({
    queryKey: ["memo-list", take, keywords],
    queryFn: ({ pageParam = 1 }) =>
      getMemoList({ page: pageParam as number, take, keywords }),
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

  const updateMemoList = (updatedMemo: MemoItem) => {
    queryClient.setQueryData(["memo-list", take], (oldData: any) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((memo: MemoItem) =>
            memo.id === updatedMemo.id ? updatedMemo : memo
          )
        }))
      }
    })
  }
  return {
    ...infiniteQuery,
    updateMemoList
  }
}

export const updateMemo = async ({
  id,
  data
}: UpdateMemoParams): Promise<MemoItem> => {
  const response = await client.put(`/users/memos/${id}`, data)
  return response.data
}

export const useUpdateMemo = (
  options?: Partial<UseMutationOptions<MemoItem, Error, UpdateMemoParams>>
) => {
  return useMutation({
    ...options,
    mutationKey: ["update-memo"],
    mutationFn: updateMemo
  })
}

export const postMemoData = async (data: PostMemoParams): Promise<MemoItem> => {
  const response = await client.post("/users/memos", data)
  return response.data
}

export const useCreateMemo = (
  options?: Partial<UseMutationOptions<MemoItem, Error, PostMemoParams>>
) => {
  return useMutation({
    ...options,
    mutationKey: ["post-memo"],
    mutationFn: postMemoData
  })
}

export const deleteMemo = async ({ id }: { id: string }) => {
  const response = await client.delete(`/users/memos/${id}`)
  return response.data
}

export const useDeleteMemo = () => {
  return useMutation({
    mutationKey: ["delete-memo"],
    mutationFn: deleteMemo
  })
}
