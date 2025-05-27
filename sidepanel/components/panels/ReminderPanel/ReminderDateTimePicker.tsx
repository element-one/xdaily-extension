"use client"

import dayjs from "dayjs"
import type { FC } from "react"

import { InputBox } from "~sidepanel/components/ui/InputBox"

interface Props {
  fromAt: string
  toAt: string
  onChange: (value: { fromAt: string; toAt: string }) => void
}

export const ReminderDateTimeRangePicker: FC<Props> = ({
  fromAt,
  toAt,
  onChange
}) => {
  const now = dayjs()

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value
    const fromTime = dayjs(newFrom)
    const currentTo = dayjs(toAt)

    let updatedTo = toAt
    if (!toAt || currentTo.isBefore(fromTime)) {
      updatedTo = fromTime.add(1, "hour").format("YYYY-MM-DDTHH:mm")
    }

    onChange({ fromAt: newFrom, toAt: updatedTo })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ fromAt, toAt: e.target.value })
  }

  return (
    <div className="flex w-full items-center flex-col gap-1">
      <InputBox
        type="datetime-local"
        value={fromAt}
        onChange={handleFromChange}
      />
      <div className="text-xs text-text-default-secondary">|</div>
      <InputBox
        type="datetime-local"
        value={toAt}
        onChange={handleToChange}
        min={fromAt}
        disabled={!fromAt}
      />
    </div>
  )
}
