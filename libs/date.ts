import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const formatRelativeTime = (datetimeStr: string) => {
  const now = dayjs()
  const time = dayjs(datetimeStr)
  const diffMinutes = now.diff(time, "minute")
  const diffHours = now.diff(time, "hour")
  const diffDays = now.diff(time, "day")

  if (diffMinutes < 60) {
    return `${diffMinutes}m`
  } else if (diffHours < 24) {
    return `${diffHours}h`
  } else if (diffDays === 1) {
    return "last day"
  } else {
    return time.format("MMM D")
  }
}
