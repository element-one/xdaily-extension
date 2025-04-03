import type { PlasmoMessaging } from "@plasmohq/messaging"

// TODO: add api to check if user is kol
const handler: PlasmoMessaging.MessageHandler<{ userId: string }> = async (
  req,
  res
) => {
  //   const userId = req.body.userId
  //   try {
  //     console.log("use this tweetId", userId)
  //   } catch (e) {
  //     console.log(e)
  //   }
  res.send(true)
}

export default handler
