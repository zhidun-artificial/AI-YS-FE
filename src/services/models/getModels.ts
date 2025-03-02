import { httpGet } from "../http"


interface GetModelsResponse {
  embeddings: string[],
  llm: string[],
}


export const getModels = async () => {
  return httpGet<object, GetModelsResponse>('/api/v1/models/show', {})
}