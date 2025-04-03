import { useState } from "react"

import { ChatWindow } from "./ChatWindow"

export const ChatStatusSection = ({ screenName }: { screenName: string }) => {
  const [isKOL, setIsKOL] = useState(true)

  const handleApply = () => {}

  if (isKOL) {
    return <ChatWindow screenName={screenName} key={screenName} />
  }

  //   apply
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <div className="text-base font-semibold">
        <span className="font-bold">{screenName}</span> is not KOL at present
      </div>
      <button
        onClick={handleApply}
        className="rounded-md bg-primary-brand text-white  px-4 py-2 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary-brand">
        APPLY
      </button>
    </div>
  )
}
