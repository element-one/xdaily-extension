import clsx from "clsx"
import { CopyIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useInviteCode, useInviteHistory } from "~services/invite"
import { Button } from "~sidepanel/components/ui/Button"
import { InputBox } from "~sidepanel/components/ui/InputBox"

const ColorMapClass = [
  "text-primary-brand bg-primary-brand/20",
  "text-green bg-green/20",
  "text-cyan bg-cyan/20",
  "text-purple bg-purple/20",
  "text-red bg-red/20",
  "text-white bg-white/20"
]
export const InvitePanel = () => {
  const { t } = useTranslation()
  const { data: inviteCode } = useInviteCode()
  const { data: inviteHistoryData } = useInviteHistory()

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (inviteCode?.url) {
      navigator.clipboard
        .writeText(inviteCode.url)
        .then(() => {
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        })
        .catch((err) => {
          console.error("copy failed", err)
        })
    }
  }

  const inviteData = useMemo(() => {
    return (inviteHistoryData?.data ?? []).map((item, index) => {
      const themeClass = ColorMapClass[index % ColorMapClass.length]
      return {
        ...item,
        themeClass
      }
    })
  }, [inviteHistoryData])

  return (
    <div className="flex flex-col h-full py-2 min-h-0 flex-1">
      <div>
        <div className="h-6 text-text-default-primary text-base">
          {t("invite_panel.title")}
        </div>
        <div className="text-xs leading-[18px] text-text-default-secondary">
          {t("invite_panel.desc")}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <InputBox
          placeholder="URL+邀请码"
          className="flex-1 min-w-0"
          value={inviteCode?.url ?? ""}
          readOnly
        />
        <Button className="shrink-0 text-sm gap-1" onClick={handleCopy}>
          <CopyIcon className="w-4 h-4 scale-x-[-1]" />{" "}
          <span>
            {copied ? t("invite_panel.copied") : t("invite_panel.copy")}
          </span>
        </Button>
      </div>
      {!!inviteData.length && (
        <div className="mt-4 flex flex-col gap-4 min-h-0 flex-1 overflow-auto">
          {inviteData.map((item) => (
            <div className="flex items-center gap-2 py-1" key={item.id}>
              <div
                className={clsx(
                  "flex w-8 h-8 items-center justify-center rounded-full",
                  item.themeClass
                )}>
                {item.referral.firstName.charAt(0)}
              </div>
              <div className="flex flex-col text-xs">
                <div className="text-text-default-primary">
                  {item.referral.firstName} {item.referral.lastName}
                </div>
                <div className="text-text-default-secondary">
                  {item.referral.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="my-4 w-full h-[1px] bg-fill-bg-input" />
      <div className="flex flex-col">
        <div className="text-sm font-light">
          <span className="text-primary-brand mr-1 inline-block">
            {inviteHistoryData?.meta.itemCount}/3
          </span>
          {t("invite_panel.free_invites")}
        </div>
        <div className="text-text-default-secondary text-xs leading-[18px]">
          {t("invite_panel.info")}
        </div>
        <div className="mt-4 w-full">
          <div className="bg-fill-bg-grey h-1 w-full rounded-full">
            <div
              className="bg-primary-brand h-full w-2/3 rounded-full"
              style={{
                width: `${((inviteHistoryData?.meta.itemCount ?? 0) / 3) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
