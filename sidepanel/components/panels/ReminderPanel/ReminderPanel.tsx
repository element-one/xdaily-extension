import clsx from "clsx"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { ReminderItem } from "~types/reminder"

import { ReminderList } from "./ReminderList"

const MockData: ReminderItem[] = [
  {
    id: "1",
    date: new Date("2025-5-14")
  },
  {
    id: "2",
    date: new Date("2025-5-15")
  },
  {
    id: "3",
    date: new Date("2025-5-16")
  },
  {
    id: "4",
    date: new Date("2025-5-17")
  },
  {
    id: "5",
    date: new Date("2025-5-18")
  }
] as const

export const ReminderPanel = () => {
  const ReminderData = MockData.slice(0)
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(
    null
  )

  useEffect(() => {
    // select if not selected
    if (ReminderData.length > 0 && !selectedReminder) {
      setSelectedReminder(ReminderData[0])
    }
  }, [ReminderData, selectedReminder])

  const handleSelectReminder = (item: ReminderItem) => {
    if (item.id !== selectedReminder.id) {
      setSelectedReminder(item)
      const ref = tabRefs.current[item.id]
      if (ref) {
        ref.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        })
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Reminder" />
      <main className="flex-1 min-h-0 flex flex-col overflow-y-hidden overflow-x-hidden py-4">
        {!!ReminderData.length ? (
          <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-scroll hide-scrollbar">
            {selectedReminder && (
              <div className="h-[18px] text-xs text-text-default-secondary">
                {dayjs(selectedReminder.date).format("MMMM D, YYYY")}
              </div>
            )}
            <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar">
              {ReminderData.map((item) => (
                <div
                  onClick={() => handleSelectReminder(item)}
                  ref={(el) => (tabRefs.current[item.id] = el)}
                  className={clsx(
                    "bg-fill-bg-light py-1 group cursor-pointer w-14 h-[74px] rounded-lg border transition-all shrink-0 flex flex-col gap-2 hover:border-primary-brand hover:text-primary-brand",
                    selectedReminder?.id === item.id
                      ? "border-primary-brand text-primary-brand"
                      : "border-fill-bg-input text-text-default-secondary"
                  )}>
                  <div className="h-[18px] flex items-center justify-center text-xs">
                    {dayjs(item.date).format("ddd").toUpperCase()}
                  </div>
                  <div
                    className={clsx(
                      "border w-full group-hover:border-primary-brand",
                      selectedReminder?.id === item.id
                        ? "border-primary-brand"
                        : "border-fill-bg-input"
                    )}
                  />
                  <div className="flex-1 text-xl font-bold flex items-center justify-center">
                    {dayjs(item.date).format("DD")}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex min-h-0 flex-1 overlfow-y-auto hide-scrollbar">
              {selectedReminder ? (
                <ReminderList item={selectedReminder} />
              ) : (
                <EmptyContent content="No Reminder" />
              )}
            </div>
          </section>
        ) : (
          <EmptyContent content="No Reminder Now" />
        )}
        {/* load more */}
        {/* <div ref={bottomObserver} className="h-4 w-full" /> */}
        {/* {isFetchingNextPage && <p className="text-center">loading...</p>} */}
      </main>
    </div>
  )
}
