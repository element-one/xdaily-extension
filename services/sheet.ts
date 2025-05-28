import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  GetSheetListParams,
  GetSheetListResp,
  PostSheetDataParam,
  SheetItem
} from "~types/sheet"

export const getSheetList = async ({
  page,
  take,
  keywords
}: GetSheetListParams): Promise<GetSheetListResp> => {
  let url = `/users/sheets?page=${page}&take=${take}`
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`
  }
  const response = await client.get(url)
  return response.data
}

export const useSheetList = (take: number, keywords?: string) => {
  const queryClient = useQueryClient()

  const infiniteQuery = useInfiniteQuery<
    GetSheetListResp,
    Error,
    InfiniteData<SheetItem>
  >({
    queryKey: ["sheet-list", take, keywords],
    queryFn: ({ pageParam = 1 }) =>
      getSheetList({ page: pageParam as number, take, keywords }),
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

  const updateSheetList = (updatedSheet: SheetItem) => {
    queryClient.setQueryData(["sheet-list", take], (oldData: any) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((sheet: SheetItem) =>
            sheet.id === updatedSheet.id ? updatedSheet : sheet
          )
        }))
      }
    })
  }
  return {
    ...infiniteQuery,
    updateSheetList
  }
}

export const postSheetData = async (
  data: PostSheetDataParam
): Promise<SheetItem> => {
  const response = await client.post("/users/sheets", data)
  return response.data
}

export const useCreateSheet = (
  options?: Partial<UseMutationOptions<SheetItem, Error, PostSheetDataParam>>
) => {
  return useMutation({
    ...options,
    mutationKey: ["post-sheet"],
    mutationFn: postSheetData
  })
}

export const deleteSheet = async ({ id }: { id: string }) => {
  const response = await client.delete(`/users/sheets/${id}`)
  return response.data
}

export const useDeleteSheet = () => {
  return useMutation({
    mutationKey: ["delete-sheet"],
    mutationFn: deleteSheet
  })
}
