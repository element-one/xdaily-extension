import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { UserIcon } from "lucide-react"

import { useStore } from "~store/store"

export const UserAvatar = () => {
  const wrapperClassName =
    "w-8 h-8 bg-primary-brand rounded-full overflow-hidden"
  const menuItemClassName =
    "focus:bg-slate-100 relative select-none rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal flex flex-row items-center gap-x-2"
  const userInfo = useStore((state) => state.userInfo)

  const jumpToProfilePage = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}`
    })
  }
  if (!userInfo) {
    return <div className={wrapperClassName} />
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className={wrapperClassName}>
          {!!userInfo.profileImageUrl && (
            <img
              src={userInfo.profileImageUrl}
              className="size-full object-contain"
            />
          )}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={5}
        className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-thinborder bg-white p-1 text-slate-900 shadow-md">
        <DropdownMenu.Item
          className={menuItemClassName}
          onSelect={jumpToProfilePage}>
          <div className={wrapperClassName}>
            {!!userInfo.profileImageUrl && (
              <img
                src={userInfo.profileImageUrl}
                className="size-full object-contain"
              />
            )}
          </div>
          <div className="text-slate-900 text-sm">
            <div className="font-semibold flex flex-row gap-x-1">
              <span>{userInfo?.firstName}</span>
              <span>{userInfo?.lastName}</span>
            </div>
            <div className="text-xs">{userInfo?.email}</div>
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={menuItemClassName}
          onSelect={jumpToProfilePage}>
          <div className="w-full flex flex-row items-center justify-center gap-x-1">
            <UserIcon className="size-5" />
            <div>My Account</div>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
