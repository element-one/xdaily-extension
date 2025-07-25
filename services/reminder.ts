import {
  useInfiniteQuery,
  useMutation,
  type InfiniteData,
  type UseMutationOptions
} from "@tanstack/react-query"
import dayjs from "dayjs"

import client from "~libs/client"
import type {
  CreateReminderParams,
  GetRemindersParmas,
  GetRemindersResp,
  ReminderItem,
  UpdateReminderParam
} from "~types/reminder"

export const getReminders = async ({
  page,
  take,
  keywords
}: GetRemindersParmas): Promise<GetRemindersResp> => {
  let url = `/users/reminders?page=${page}`
  if (take) {
    url += `&take=${take}`
  }
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`
  }
  const response = await client.get(url)
  return response.data
}

export const useReminders = ({
  take,
  keywords
}: {
  take?: number
  keywords?: string
}) => {
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
    queryKey: ["user-collections", take, keywords],
    queryFn: ({ pageParam = 1 }) =>
      getReminders({ page: pageParam as number, take, keywords }),
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

export const createReminder = async (
  data: CreateReminderParams
): Promise<ReminderItem> => {
  const response = await client.post("/users/reminders", data)
  return response.data
}

export const useCreateReminder = (
  options?: Partial<
    UseMutationOptions<ReminderItem, Error, CreateReminderParams>
  >
) => {
  return useMutation({
    ...options,
    mutationKey: ["create-reminder"],
    mutationFn: createReminder
  })
}

export const deleteReminder = async ({ id }: { id: string }) => {
  const response = await client.delete(`/users/reminders/${id}`)
  return response.data
}

export const useDeleteReminder = () => {
  return useMutation({
    mutationKey: ["delete-reminder"],
    mutationFn: deleteReminder
  })
}

export const updateReminder = async ({
  id,
  data
}: UpdateReminderParam): Promise<ReminderItem> => {
  const response = await client.put(`/users/reminders/${id}`, data)
  return response.data
}
export const useUpdateReminder = (
  options?: Partial<
    UseMutationOptions<ReminderItem, Error, UpdateReminderParam>
  >
) => {
  return useMutation({
    ...options,
    mutationKey: ["update-reminder"],
    mutationFn: updateReminder
  })
}
