import * as Dialog from "@radix-ui/react-dialog"
import dayjs from "dayjs"
import { useEffect, useMemo, useState, type FC } from "react"

import { localInputToUTC, utcToLocalInput } from "~libs/date"
import { useCreateReminder, useUpdateReminder } from "~services/reminder"
import { Button } from "~sidepanel/components/ui/Button"
import { InputBox } from "~sidepanel/components/ui/InputBox"
import { useToast } from "~sidepanel/components/ui/Toast"
import type { DialogReminderItem } from "~types/reminder"

import { ReminderDateTimeRangePicker } from "./ReminderDateTimePicker"

interface ReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reminderItem: DialogReminderItem | null
  onComplete?: () => void
}

export const ReminderDialog: FC<ReminderDialogProps> = ({
  open,
  onOpenChange,
  onComplete,
  reminderItem
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [timeRange, setTimeRange] = useState({
    fromAt: "",
    toAt: ""
  })
  const { showToast } = useToast()

  const isUpdateMode = !!reminderItem?.id

  const toast = (msg: string) => {
    showToast({
      type: "error",
      title: "Error",
      description: msg
    })
  }

  useEffect(() => {
    if (open) {
      if (reminderItem) {
        setTitle(reminderItem.title)
        setDescription(reminderItem.description)
        setTimeRange({
          fromAt: utcToLocalInput(reminderItem.fromAt),
          toAt: utcToLocalInput(reminderItem.toAt)
        })
      } else {
        setTitle("")
        setDescription("")
        setTimeRange({
          fromAt: "",
          toAt: ""
        })
      }
    }
  }, [reminderItem, open])

  const { mutate: createReminder, isPending: isCreating } = useCreateReminder()
  const { mutate: updateReminder, isPending: isUpdating } = useUpdateReminder()

  const handleSubmit = () => {
    const fromAt = timeRange.fromAt
    const toAt = timeRange.toAt
    const from = dayjs(fromAt)
    const to = dayjs(toAt)

    if (!title || !fromAt || !toAt) {
      toast("Please fill in all the information")
      return
    }

    if (!to.isAfter(from)) {
      toast("End time must be later than start time")
      return
    }

    if (isUpdateMode) {
      handleUpdateReminder()
    } else {
      handleCreateReminder()
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setTimeRange({
      fromAt: "",
      toAt: ""
    })
    onOpenChange(false)
  }

  const handleUpdateReminder = () => {
    if (!isUpdateMode) return
    updateReminder(
      {
        id: reminderItem.id,
        data: {
          title,
          description,
          fromAt: localInputToUTC(timeRange.fromAt),
          toAt: localInputToUTC(timeRange.toAt)
        }
      },
      {
        onSuccess() {
          handleCancel()
          onComplete?.()
        },
        onError() {
          toast("Something wrong, please try again")
        }
      }
    )
  }

  const handleCreateReminder = () => {
    createReminder(
      {
        title,
        description,
        fromAt: localInputToUTC(timeRange.fromAt),
        toAt: localInputToUTC(timeRange.toAt)
      },
      {
        onSuccess() {
          handleCancel()
          onComplete?.()
        },
        onError() {
          toast("Something wrong, please try again")
        }
      }
    )
  }

  const isOperating = useMemo(() => {
    return isCreating || isUpdating
  }, [isCreating, isUpdating])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) =>
        !isOperating && (open ? onOpenChange(true) : handleCancel())
      }>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-fill-bg-light rounded-lg p-6  border border-fill-bg-input space-y-4 text-text-default-primary">
          <Dialog.Title className="text-base">
            {isUpdateMode ? "Edit Reminder" : "New Reminder"}
          </Dialog.Title>
          <div className="space-y-2">
            <InputBox
              placeholder="Reminder Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputBox
              placeholder="Reminder Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ReminderDateTimeRangePicker
              fromAt={timeRange.fromAt}
              toAt={timeRange.toAt}
              onChange={(val) => setTimeRange(val)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              disabled={isOperating}
              onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isOperating}>
              {isUpdateMode
                ? isOperating
                  ? "Updating"
                  : "Update"
                : isOperating
                  ? "Creating"
                  : "Create"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
