import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { LanguagesIcon } from "lucide-react"
import type { FC } from "react"

import { useTranslation } from "~node_modules/react-i18next"

export const LanguageSelector: FC = () => {
  const { i18n } = useTranslation()

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="rounded-full hover:bg-white/10 w-9 h-9 flex items-center justify-center outline-none select-none text-text-default-regular">
        <LanguagesIcon className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={0}
        className="z-50 min-w-[200px] mr-4 overflow-hidden rounded-md border border-fill-bg-input bg-fill-bg-light text-text-default-primary shadow-md">
        <DropdownMenu.Item
          className={clsx(
            "focus:bg-fill-bg-deep relative select-none rounded-sm px-3 py-2 outline-none transition-colors cursor-pointer",
            i18n.language === "en" && "text-primary-brand"
          )}
          onSelect={() => handleChangeLanguage("en")}>
          English
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={clsx(
            "focus:bg-fill-bg-deep relative select-none rounded-sm px-3 py-2 outline-none transition-colors cursor-pointer",
            i18n.language === "zh" && "text-primary-brand"
          )}
          onSelect={() => handleChangeLanguage("zh")}>
          中文
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
