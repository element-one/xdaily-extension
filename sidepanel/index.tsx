import { useEffect, useState } from "react"

function IndexSidePanel() {
  const [tweets, setTweets] = useState<{ content: string; link: string }[]>([])

  useEffect(() => {
    chrome.storage.local.get("tweets", (data) => {
      console.log(data.tweets)
      setTweets(data.tweets || [])
    })

    const onStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.tweets) {
        setTweets(changes.tweets.newValue || [])
      }
    }

    chrome.storage.onChanged.addListener(onStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(onStorageChange)
    }
  }, [])

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "sidepanel_close_self") {
      window.close()
    }
  })

  return (
    <div className="p-4 w-64">
      <h1 className="text-lg font-bold">收藏的推文</h1>
      {tweets.length === 0 ? (
        <p className="text-gray-500">暂无收藏</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {tweets.map((tweet, index) => (
            <li key={index} className="border p-2 rounded text-sm">
              <a href={tweet.link} target="_blank" className="text-blue-500">
                {tweet.content.slice(0, 50)}...
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default IndexSidePanel
