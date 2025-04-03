import clsx from "clsx"
import { useState } from "react"

import { useApplyKol, useCheckKolStatus } from "~services/chat"
import { KolStatus } from "~types/enum"

import { ChatWindow } from "./ChatWindow"

export const ChatStatusSection = ({ screenName }: { screenName: string }) => {
  const { data, refetch } = useCheckKolStatus(screenName)

  const { mutate: apply, isPending } = useApplyKol()

  const handleApply = () => {
    if (isPending) return
    apply(screenName, {
      onSuccess() {
        refetch()
      },
      onError() {}
    })
  }

  if (data && data?.kolStatus === KolStatus.APPROVED) {
    return <ChatWindow screenName={screenName} key={screenName} />
  }

  //   apply
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <div className="text-base font-semibold flex flex-col gap-1 items-center justify-center">
        <div className="font-bold">@{screenName}</div>
        <div>is not KOL at present</div>
      </div>
      {data?.kolStatus === KolStatus.APPLYING ? (
        <div>Please wait for approvement</div>
      ) : (
        // data is none => means need to apply
        <button
          onClick={handleApply}
          className={clsx(
            "rounded-md bg-primary-brand text-white  px-4 py-2 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary-brand",
            isPending && "opacity-70 cursor-not-allowed"
          )}>
          APPLY
        </button>
      )}
    </div>
  )
}
