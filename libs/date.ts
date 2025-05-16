import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const formatTweetDate = (datetimeStr: string) => {
  const date = isNaN(Number(datetimeStr)) ? datetimeStr : Number(datetimeStr)
  return dayjs(date).format("h:mma ・MMM.D,YYYY")
}

export const formatRelativeTime = (datetimeStr: string) => {
  const date = isNaN(Number(datetimeStr)) ? datetimeStr : Number(datetimeStr)
  const now = dayjs()
  const time = dayjs(date)
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
