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
  take
}: GetSheetListParams): Promise<GetSheetListResp> => {
  const response = await client.get(`/users/sheets?page=${page}&take=${take}`)
  return response.data
}

export const useSheetList = (take: number) => {
  const queryClient = useQueryClient()

  const infiniteQuery = useInfiniteQuery<
    GetSheetListResp,
    Error,
    InfiniteData<SheetItem>
  >({
    queryKey: ["sheet-list", take],
    queryFn: ({ pageParam = 1 }) =>
      getSheetList({ page: pageParam as number, take }),
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
