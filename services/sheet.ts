import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData
} from "@tanstack/react-query"

import client from "~libs/client"
import type {
  GetSheetListParams,
  GetSheetListResp,
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
