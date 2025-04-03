import client from "~libs/client"

export const chatWithUser = async ({
  message,
  id
}: {
  message: string
  id: string
}) => {
  const response = await client.post(`/users/chat/${id}`, {
    message
  })
  return response.data
}
