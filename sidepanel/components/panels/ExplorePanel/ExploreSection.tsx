import { useState, type FC } from "react"

import { ExploreSearchSubSection } from "./SubSection/ExploreSearchSubSection"
import { KolSubSection } from "./SubSection/KolSubSection"

export const ExploreSection: FC = () => {
  const [showExploreSearch, setShowExploreSearch] = useState(false)

  if (showExploreSearch) {
    return (
      <ExploreSearchSubSection onClose={() => setShowExploreSearch(false)} />
    )
  }

  return <KolSubSection onFilter={() => setShowExploreSearch(true)} />
}
