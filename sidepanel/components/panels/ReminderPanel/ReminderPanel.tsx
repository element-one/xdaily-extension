import clsx from "clsx"
import dayjs from "dayjs"
import { useEffect, useMemo, useRef, useState } from "react"

import { useReminders } from "~services/reminder"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"

import { ReminderList } from "./ReminderList"

export const ReminderPanel = () => {
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const listWrapperRef = useRef<HTMLDivElement | null>(null)

  const [selectedId, setSelectedId] = useState("")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReminders(20)

  console.log("data", data)

  const reminderData = useMemo(() => {
    return data?.pages ?? []
  }, [data])

  useEffect(() => {
    const firstItem = reminderData[0]
    if (firstItem) {
      setSelectedId(firstItem.id)
    }
  }, [reminderData])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) {
          const visibleId = visible.target.getAttribute("data-id")
          if (visibleId && visibleId !== selectedId) {
            setSelectedId(visibleId)
          }
        }
      },
      {
        root: listWrapperRef.current,
        threshold: 0.5
      }
    )

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [selectedId])

  useEffect(() => {
    const currentTab = tabRefs.current[selectedId]
    if (currentTab) {
      currentTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      })
    }
  }, [selectedId])

  const handleSelectTab = (id: string) => {
    const section = sectionRefs.current[id]
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  // loading

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Reminder" />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden py-4">
        {!!reminderData.length ? (
          <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
            <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar px-4">
              {reminderData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  ref={(el) => (tabRefs.current[item.id] = el)}
                  className={clsx(
                    "bg-fill-bg-light py-1 group cursor-pointer w-14 h-[74px] rounded-lg border transition-all shrink-0 flex flex-col gap-2 hover:border-primary-brand hover:text-primary-brand",
                    selectedId === item.id
                      ? "border-primary-brand text-primary-brand"
                      : "border-fill-bg-input text-text-default-secondary"
                  )}>
                  <div className="h-[18px] flex items-center justify-center text-xs">
                    {dayjs(item.id).format("ddd").toUpperCase()}
                  </div>
                  <div
                    className={clsx(
                      "border w-full group-hover:border-primary-brand",
                      selectedId === item.id
                        ? "border-primary-brand"
                        : "border-fill-bg-input"
                    )}
                  />
                  <div className="flex-1 text-xl font-bold flex items-center justify-center">
                    {dayjs(item.id).format("DD")}
                  </div>
                </div>
              ))}
            </div>
            <div
              ref={listWrapperRef}
              className="flex-1 overflow-y-auto hide-scrollbar px-4">
              <ReminderList data={reminderData} sectionRefs={sectionRefs} />
            </div>
          </section>
        ) : (
          <EmptyContent content="No Reminder Now" />
        )}
      </main>
    </div>
  )
}
