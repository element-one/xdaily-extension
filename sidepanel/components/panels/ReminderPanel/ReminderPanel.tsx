import clsx from "clsx"
import dayjs from "dayjs"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useReminders } from "~services/reminder"
import { Button } from "~sidepanel/components/ui/Button"
import { Divider } from "~sidepanel/components/ui/Divider"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"

import { CreateReminderDialog } from "./CreateReminderDialog"
import { ReminderList } from "./ReminderList"

const ReminderPanelSkeleton = () => {
  return (
    <div className="mt-4 py-2 flex flex-col gap-4">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="border border-fill-bg-input rounded-lg py-3 bg-fill-bg-light  flex flex-col items-start gap-2">
            <div className="flex items-center mx-3 gap-1 w-full">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="w-2/3 h-4" />
            </div>
            <div className="w-full px-3">
              <Skeleton className="w-full h-4" />
            </div>
            <Divider />
            <div className="flex w-full items-center justify-between text-text-default-secondary mx-3">
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
    </div>
  )
}
export const ReminderPanel = () => {
  const { data, isLoading, refetch } = useReminders() // do not use take

  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const listWrapperRef = useRef<HTMLDivElement | null>(null)

  const [selectedId, setSelectedId] = useState("")
  const [isScrollable, setIsScrollable] = useState(false)

  const [isDialogOpen, onDialogChange] = useState(false)

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
    const wrapper = listWrapperRef.current
    if (!wrapper) return

    const checkScrollable = () => {
      setIsScrollable(wrapper.scrollHeight > wrapper.clientHeight)
    }

    checkScrollable()

    window.addEventListener("resize", checkScrollable)
    return () => {
      window.removeEventListener("resize", checkScrollable)
    }
  }, [reminderData])

  useEffect(() => {
    if (!isScrollable) return

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
  }, [isScrollable, selectedId])

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
    setSelectedId(id)
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  const handleAddClick = () => {
    console.log("testing")
    onDialogChange(true)
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <PanelHeader
          title="Reminder"
          rightContent={
            <div className="flex items-center gap-x-2">
              <button className="w-5 h-5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50">
                <SearchIcon className="w-5 h-5 text-text-default-regular" />
              </button>
              <Button variant="ghost" className="p-0" onClick={handleAddClick}>
                <div className="text-primary-brand border-[2px] rounded-md border-primary-brand w-4 h-4 flex items-center justify-center">
                  <PlusIcon className="w-4 h-4" strokeWidth={4} />
                </div>
              </Button>
            </div>
          }
        />
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden py-4">
          {isLoading ? (
            <ReminderPanelSkeleton />
          ) : !!reminderData.length ? (
            <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
              <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar">
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
                className="flex-1 overflow-y-auto hide-scrollbar">
                <ReminderList data={reminderData} sectionRefs={sectionRefs} />
              </div>
            </section>
          ) : (
            <EmptyContent content="No Reminder Now" />
          )}
        </main>
      </div>
      <CreateReminderDialog
        open={isDialogOpen}
        onOpenChange={onDialogChange}
        onCreateComplete={refetch}
      />
    </>
  )
}
