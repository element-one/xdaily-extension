import { FileTextIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import PostIcon from "~sidepanel/components/icons/PostIcon"
import TextTabIcon from "~sidepanel/components/icons/TextTabIcon"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { TabContent, Tabs, TabTrigger } from "~sidepanel/components/ui/Tabs"

import { FileTabContent } from "./FileTabContent"
import { PostTabContent } from "./PostTabContent"
import { TextTabContent } from "./TextTabContent"

enum KnowledgeType {
  FILE = "knowledge_file",
  TEXT = "knowledge_text",
  POST = "knowledge_post"
}

const TabData = [
  {
    key: KnowledgeType.FILE,
    labelI18nKey: "knowledge_panel.tab_file",
    icon: <FileTextIcon className="w-4 h-4 text-primary-brand shrink-0" />,
    content: <FileTabContent />
  },
  {
    key: KnowledgeType.TEXT,
    labelI18nKey: "knowledge_panel.tab_text",
    icon: <TextTabIcon className="w-5 h-5 text-green shrink-0" />,
    content: <TextTabContent />
  },
  {
    key: KnowledgeType.POST,
    labelI18nKey: "knowledge_panel.tab_post",
    icon: <PostIcon className="w-4 h-4 text-purple shrink-0" />,

    content: <PostTabContent />
  }
]
export const KnowledgeBasePanel = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title={t("knowledge_panel.title")} />
      <Tabs
        distributeEvenly={true}
        defaultValue={KnowledgeType.POST}
        className="mt-3 flex flex-col min-h-0 flex-1">
        <Tabs.List>
          {TabData.map((tab) => (
            <TabTrigger key={tab.key} value={tab.key}>
              <div className="gap-1 flex items-center text-xs">
                {tab.icon}
                {t(tab.labelI18nKey)}
              </div>
            </TabTrigger>
          ))}
        </Tabs.List>
        {TabData.map((tab) => (
          <TabContent key={tab.key} value={tab.key}>
            {tab.content}
          </TabContent>
        ))}
      </Tabs>
    </div>
  )
}
