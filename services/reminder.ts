import {
  useInfiniteQuery,
  useMutation,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"
import dayjs from "dayjs"

import client from "~libs/client"
import type {
  GetRemindersParmas,
  GetRemindersResp,
  ReminderItem
} from "~types/reminder"

export const getReminders = async ({
  page,
  take
}: GetRemindersParmas): Promise<GetRemindersResp> => {
  const response = await client.get(
    `/users/reminders?page=${page}&take=${take}`
  )
  return response.data
}

// export const useReminders = (take: number) => {
//   return useInfiniteQuery<GetRemindersResp, Error, InfiniteData<ReminderItem>>({
//     queryKey: ["user-collections", take],
//     queryFn: ({ pageParam = 1 }) =>
//       getReminders({ page: pageParam as number, take }),
//     initialPageParam: 1,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     getNextPageParam: (lastPage) => {
//       return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined
//     },
//     select: (data) => ({
//       pages: data.pages.map((page) => page.data).flat(),
//       pageParams: data.pageParams
//     })
//   })
// }

export const useReminders = (take: number) => {
  return useInfiniteQuery<
    GetRemindersResp,
    Error,
    {
      pages: {
        id: string
        items: ReminderItem[]
      }[]
      pageParams: number[]
    }
  >({
    queryKey: ["user-collections", take],
    queryFn: ({ pageParam = 1 }) =>
      getReminders({ page: pageParam as number, take }),
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    select: (data) => {
      const groupMap = new Map<string, ReminderItem[]>()

      for (const page of data.pages) {
        for (const item of page.data) {
          const dateId = dayjs(item.fromAt).format("YYYY-MM-DD")
          if (!groupMap.has(dateId)) {
            groupMap.set(dateId, [])
          }
          groupMap.get(dateId)!.push(item)
        }
      }

      const pages = Array.from(groupMap.entries()).map(([id, items]) => ({
        id,
        items
      }))

      pages.sort((a, b) => a.id.localeCompare(b.id))

      return {
        pages,
        pageParams: data.pageParams as number[]
      }
    }
  })
}
