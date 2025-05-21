import clsx from "clsx"
import dayjs from "dayjs"
import { ClockIcon } from "lucide-react"
import type { FC } from "react"

import {
  ReminderStatus,
  type ReminderDetailItem,
  type ReminderItem
} from "~types/reminder"

const MOCKING_DETAILS: ReminderDetailItem[] = [
  {
    timeSpan: "09:00-09:30",
    status: ReminderStatus.PENDING,
    title: "Pending title",
    info: "info"
  },
  {
    timeSpan: "10:00-10:30",
    status: ReminderStatus.UPCOMING,
    title: "upcoming title one",
    info: "info"
  },
  {
    timeSpan: "14:00-14:30",
    status: ReminderStatus.UPCOMING,
    title: "upcoming title two",
    info: "info"
  },
  {
    timeSpan: "15:00-15:30",
    status: ReminderStatus.UPCOMING,
    title: "upcoming title three",
    info: "info"
  },
  {
    timeSpan: "10:00-11:30",
    status: ReminderStatus.CANCEL,
    title: "cancel title",
    info: "info"
  },
  {
    timeSpan: "11:00-11:30",
    status: ReminderStatus.CANCEL,
    title: "cancel title",
    info: "info"
  },
  {
    timeSpan: "12:00-12:30",
    status: ReminderStatus.RECURRING,
    title: "recurring title",
    info: "info"
  },
  {
    timeSpan: "14:00-14:30",
    status: ReminderStatus.PAST,
    title: "past title",
    info: "info"
  }
]

const colorMaps = {
  [ReminderStatus.UPCOMING]: "#FFE600",
  [ReminderStatus.CANCEL]: "#FFFFFF80",
  [ReminderStatus.PAST]: "#AF52DE",
  [ReminderStatus.RECURRING]: "#32ADE6",
  [ReminderStatus.PENDING]: "#34C759"
}

interface ReminderListProps {
  data: ReminderItem[]
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

export const ReminderList: FC<ReminderListProps> = ({ data, sectionRefs }) => {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          ref={(el) => (sectionRefs.current[item.id] = el)}
          data-id={item.id}
          className="flex flex-col gap-2">
          <div className="text-sm font-medium text-text-default-secondary mt-2">
            {dayjs(item.date).format("MMMM D, YYYY")}
          </div>
          <div className="flex flex-col gap-y-3">
            {MOCKING_DETAILS.map((detail, index) => (
              <div
                key={index}
                className={clsx(
                  "gap-2 flex flex-col rounded-lg border border-fill-bg-input py-3 px-3 bg-fill-bg-light",
                  detail.status === ReminderStatus.CANCEL
                    ? "text-text-default-secondary"
                    : "text-text-default-primary"
                )}>
                <div className="h-6 flex items-center gap-1 text-base font-semibold">
                  <ClockIcon className="w-4 h-4 text-orange" />
                  <span>{detail.timeSpan}</span>
                </div>
                <div className="font-medium text-sm">{detail.info}</div>
                <div className="w-full h-[1px] bg-fill-bg-input" />
                <div className="h-[18px] flex gap-1 items-center">
                  <span
                    className="inline-block w-1 h-1 rounded-full translate-y-[2px]"
                    style={{ backgroundColor: colorMaps[detail.status] }}
                  />
                  <span
                    className="capitalize text-xs"
                    style={{ color: colorMaps[detail.status] }}>
                    {detail.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
