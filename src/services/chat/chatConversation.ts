import { httpStream } from '../http';

export interface DocFileInfo {
  id: string;
  fileName: string;
  url: string;
}

interface ChatRequest {
  conversationId: string;
  query: string;
  llmModel?: string;
  baseIds?: string[];
  files?: DocFileInfo[];
}

export const chatWithAgent = async (params: ChatRequest) => {
  return httpStream<ChatRequest>('/api/v1/chat/conversations/chat', params);
};
