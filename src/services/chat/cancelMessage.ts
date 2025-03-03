import { httpPost } from "../http"

interface CancelMessageRequest {
  messageId: string,
  answer: string
}

export const cancelMessage = async (params: CancelMessageRequest) => {
  return httpPost<CancelMessageRequest, undefined>('/api/v1/chat/conversations/cancel', params)
}