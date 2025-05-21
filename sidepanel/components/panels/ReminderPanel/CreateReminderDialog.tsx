import * as Dialog from "@radix-ui/react-dialog"
import dayjs from "dayjs"
import { useState, type FC } from "react"

import { useCreateReminder } from "~services/reminder"
import { Button } from "~sidepanel/components/ui/Button"
import { InputBox } from "~sidepanel/components/ui/InputBox"
import { useToast } from "~sidepanel/components/ui/Toast"

interface CreateReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateComplete?: () => void
}

export const CreateReminderDialog: FC<CreateReminderDialogProps> = ({
  open,
  onOpenChange,
  onCreateComplete
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fromAt, setFromAt] = useState("")
  const [toAt, setToAt] = useState("")
  const { showToast } = useToast()

  const toast = (msg: string) => {
    showToast({
      type: "error",
      title: "Error",
      description: msg
    })
  }

  const { mutate, isPending } = useCreateReminder({
    onSuccess: () => {
      onOpenChange(false)
      setTitle("")
      setDescription("")
      setFromAt("")
      setToAt("")
      onCreateComplete?.()
    },
    onError: () => {
      toast("Something wrong, please try again")
    }
  })

  const now = dayjs().startOf("day")

  const handleSubmit = () => {
    const from = dayjs(fromAt)
    const to = dayjs(toAt)

    if (!title || !fromAt || !toAt) {
      toast("Please fill in all the information")
      return
    }

    if (from.isBefore(now)) {
      toast("Start time cannot be earlier than today")
      return
    }

    if (to.isBefore(from)) {
      toast("End time cannot be earlier than start time")
      return
    }

    mutate({
      title,
      description,
      fromAt: from.toDate(),
      toAt: to.toDate()
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-fill-bg-light rounded-lg p-6  border border-fill-bg-input space-y-4 text-text-default-primary">
          <Dialog.Title className="text-base">New Reminder</Dialog.Title>
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
            <InputBox
              type="datetime-local"
              placeholder="Start Time"
              value={fromAt}
              onChange={(e) => setFromAt(e.target.value)}
            />
            <InputBox
              type="datetime-local"
              placeholder="End Time"
              value={toAt}
              onChange={(e) => setToAt(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating" : "Create"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
