import { Info, Save, SquareLibrary, Tags } from "lucide-react"
import { useState } from "react"

import { SuggestionSection } from "./SuggestionSection"

export const AiSuggestionPanel = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [suggestTags, setSuggestTags] = useState<string[]>([
    "tag1",
    "tag2",
    "tag3"
  ])

  const [selectedCollections, setselectedCollections] = useState<string[]>([])
  const [suggestCollections, setSuggestCollections] = useState<string[]>([
    "collection1",
    "collection2",
    "collection3",
    "collection4",
    "collection5"
  ])

  const handleTagEnter = (value) => {
    setSelectedTags((prevTags) => [...prevTags, value])
  }
  const handleTagDelete = (value) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== value))
  }
  const handleTagSuggestionClick = (value) => {
    setSuggestTags((prevTags) => prevTags.filter((tag) => tag !== value))
    setSelectedTags((prevTags) => [...prevTags, value])
  }

  const handleCollectionEnter = (value) => {
    setselectedCollections((prevTags) => [...prevTags, value])
  }
  const handleCollectionDelete = (value) => {
    setselectedCollections((prevTags) =>
      prevTags.filter((tag) => tag !== value)
    )
  }
  const handleCollectionSuggestionClick = (value) => {
    setSuggestCollections((prevTags) => prevTags.filter((tag) => tag !== value))
    setselectedCollections((prevTags) => [...prevTags, value])
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <section className="flex-grow overflow-y-auto stylized-scroll scrollbar-thin hide-scrollbar pb-3">
        <div className="flex gap-3 bg-white mb-2 rounded-t-md relative items-center border-b pb-2">
          <div className="h-14 w-14 rounded-md object-contain bg-purple-100 flex-shrink-0"></div>
          <div className="w-full overflow-hidden">
            <p
              className="mt-2 text-sm font-semibold"
              title="This is title of this tweet">
              This is title of the tweet
            </p>
            <p
              className="mt-1 w-[80%] truncate text-gray-600"
              title="This is the description of this tweet">
              This is the description of this tweet
            </p>
          </div>
        </div>
        {/* control part */}
        <div className="mt-4 flex flex-col gap-y-3">
          {/* Tags */}
          <SuggestionSection
            title="Tags"
            titleInfo="Tags are automatically generated from the bookmark, you can update your tags manually for enhanced search features."
            titleIcon={<Tags className="w-4 h-4" />}
            placeholder="Add Tag"
            handleEnter={handleTagEnter}
            suggestionTitle="AI Suggested Tags"
            suggestionTip="Choose these AI generated tags to save with your bookmark"
            suggestionItems={suggestTags}
            selectedTags={selectedTags}
            handleDeleteClick={handleTagDelete}
            handleSuggestionClick={handleTagSuggestionClick}
          />
          <SuggestionSection
            title="Collection"
            titleInfo="Categorize your bookmarks using themes and relevant topics"
            titleIcon={<SquareLibrary className="w-4 h-4" />}
            placeholder="Add a collection"
            handleEnter={handleCollectionEnter}
            suggestionTitle="AI Suggested Collections"
            suggestionTip="Choose these AI generated collection to organise your bookmark"
            suggestionItems={suggestCollections}
            selectedTags={selectedCollections}
            handleDeleteClick={handleCollectionDelete}
            handleSuggestionClick={handleCollectionSuggestionClick}
          />
          {/* Add notes */}
          <div className="flex flex-col gap-y-2">
            <div className="bg-white flex flex-col gap-y-1">
              {/* title part */}
              <div className="flex flex-col gap-y-1">
                <div className="flex flex-row items-center justify-start gap-x-2">
                  <h1 className="font-poppins font-medium flex items-center text-base gap-1 text-foreground leading-[175%] tracking-[0.15px]">
                    Add notes
                  </h1>
                </div>
              </div>
              {/* text area */}
              <textarea
                placeholder="Want to add quick notes?. Capture your thoughts here"
                className="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 ring-offset-active placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-32 w-full resize-none text-sm text-gray-500"
              />
            </div>
          </div>
        </div>
      </section>
      <footer className="shrink-0 bg-white shadow-md py-2">
        <div className="flex flex-row items-center justify-between">
          <section className="flex items-center">
            <button className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-poppins bg-primary-brand text-primary-foreground h-8 px-4 py-1 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </section>
        </div>
      </footer>
    </div>
  )
}
