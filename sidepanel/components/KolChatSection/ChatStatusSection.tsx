import { useApplyKol, useCheckKolStatus } from "~services/chat"
import { ChatWindow } from "~sidepanel/components/Chat/ChatWindow"
import { Button } from "~sidepanel/components/ui/Button"
import { KolStatus } from "~types/enum"

export const ChatStatusSection = ({ screenName }: { screenName: string }) => {
  const { data, refetch, isLoading } = useCheckKolStatus(screenName)

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

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center gap-4 text-primary-brand">
        loading...
      </div>
    )
  }

  if (data && data?.kolStatus === KolStatus.APPROVED) {
    return <ChatWindow screenName={screenName} />
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
        <Button onClick={handleApply}>Apply</Button>
      )}
    </div>
  )
}
