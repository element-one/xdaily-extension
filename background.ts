console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
  if (message.type === "save_tweet") {
    chrome.storage.local.get("tweets", (data) => {
      const tweets = data.tweets || []
      tweets.push({ content: message.content, link: message.link })
      chrome.storage.local.set({ tweets })
    })
  }
})
