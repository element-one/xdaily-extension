import { useTranslation } from "react-i18next"
import robotImg from "url:/assets/robot.png" // strange

import { LanguageSelector } from "./navbar/LanguageSelector"
import { Button } from "./ui/Button"

export const LoginPage = () => {
  const { t } = useTranslation()

  const handleLogin = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}/login`
    })
  }

  return (
    <div className="flex flex-col w-full max-w-md text-center h-full items-center justify-center gap-y-4">
      <div className="flex items-center justify-center">
        <img
          src={robotImg}
          aria-hidden="true"
          className="w-14 h-14 object-contain cursor-pointer"
        />
        <span className="text-[36px] leading-none font-medium text-white">
          xDaily.ai
        </span>
      </div>
      <Button className="w-2/3 h-[52px] gap-x-1" onClick={handleLogin}>
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.01334 1.91406L7.03573 8.63087L1.98206 14.0921H3.11976L7.54468 9.31094L11.1196 14.0921H14.9905L9.68579 6.99746L14.39 1.91406H13.2523L9.1776 6.31739L5.88505 1.91406L2.0141 1.91406H2.01334ZM3.68594 2.75214H5.46385L13.3164 13.254H11.5385L3.68594 2.75214Z"
            fill="black"
          />
        </svg>
        {t("login_page.sign_up")}
      </Button>
      <LanguageSelector />
    </div>
  )
}
