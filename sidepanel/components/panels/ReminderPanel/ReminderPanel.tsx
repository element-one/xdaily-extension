import clsx from "clsx"
import dayjs from "dayjs"
import { PlusIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useDebounce } from "~libs/debounce"
import { useDeleteReminder, useReminders } from "~services/reminder"
import { Button } from "~sidepanel/components/ui/Button"
import { Divider } from "~sidepanel/components/ui/Divider"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"
import { useToast } from "~sidepanel/components/ui/Toast"
import type { ReminderItem } from "~types/reminder"

import { ReminderDialog } from "./ReminderDialog"
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
  const [searchValue, setSearchValue] = useState("")
  const { data, isLoading, refetch } = useReminders({ keywords: searchValue }) // do not use take
  const { mutateAsync: deleteReminder } = useDeleteReminder()

  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const listWrapperRef = useRef<HTMLDivElement | null>(null)

  const [selectedId, setSelectedId] = useState("")
  const isProgrammaticScroll = useRef(false)

  const [isDialogOpen, onDialogChange] = useState(false)
  const [editingItem, setEditingItem] = useState<ReminderItem | null>(null)

  const { showToast } = useToast()

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

    let ticking = false

    const handleScroll = () => {
      if (ticking || isProgrammaticScroll.current) return
      ticking = true
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = wrapper
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
        if (isAtBottom) {
          ticking = false
          return
        }
        const wrapperTop = wrapper.getBoundingClientRect().top
        let closestId = ""
        let minDistance = Infinity

        Object.entries(sectionRefs.current).forEach(([id, el]) => {
          if (!el) return
          const rect = el.getBoundingClientRect()
          const distance = Math.abs(rect.top - wrapperTop)
          if (distance < minDistance) {
            closestId = id
            minDistance = distance
          }
        })
        if (closestId && closestId !== selectedId) {
          setSelectedId(closestId)
          tabRefs.current[closestId]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
          })
        }
        ticking = false
      })
    }

    wrapper.addEventListener("scroll", handleScroll)
    return () => wrapper.removeEventListener("scroll", handleScroll)
  }, [selectedId])

  const handleSelectTab = (id: string) => {
    setSelectedId(id)
    tabRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    })
    const section = sectionRefs.current[id]
    if (!section) return

    isProgrammaticScroll.current = true

    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })

    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 400)
  }

  const handleAddClick = () => {
    setEditingItem(null)
    onDialogChange(true)
  }

  const handleEditClick = (item: ReminderItem) => {
    setEditingItem(item)
    onDialogChange(true)
  }

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder({ id })
      refetch()
    } catch (e) {
      showToast({
        type: "error",
        title: "Error",
        description: "Something wrong, try later"
      })
    }
  }

  const onDialogComplete = async () => {
    await refetch()
  }

  const handleSearchChange = useDebounce((value: string) => {
    const keyword = value.trim().toLowerCase()
    setSearchValue(keyword ?? "")
  }, 800)

  return (
    <>
      <div className="flex flex-col h-full">
        <PanelHeader
          title="Reminder"
          showSearchButton={true}
          onSearchChange={handleSearchChange}
          extraRightContent={
            <Button variant="ghost" className="!p-0" onClick={handleAddClick}>
              <div className="text-primary-brand border-[2px] rounded-md border-primary-brand w-4 h-4 flex items-center justify-center">
                <PlusIcon className="w-4 h-4" strokeWidth={4} />
              </div>
            </Button>
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
                <ReminderList
                  data={reminderData}
                  sectionRefs={sectionRefs}
                  onDeleteReminder={handleDeleteReminder}
                  onEditReminder={handleEditClick}
                />
              </div>
            </section>
          ) : (
            <EmptyContent content="No Reminder Now" />
          )}
        </main>
      </div>
      <ReminderDialog
        open={isDialogOpen}
        onOpenChange={onDialogChange}
        reminderItem={editingItem}
        onComplete={onDialogComplete}
      />
    </>
  )
}
