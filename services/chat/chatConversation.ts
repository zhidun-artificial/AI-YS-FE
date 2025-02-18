import { httpStream } from '../http';

export interface DocFileInfo {
  id: string;
  fileName: string;
  url: string;
}

interface ChatRequest {
  conversationId: string;
  query: string;
  documents?: DocFileInfo[];
  tmpFiles?: DocFileInfo[];
}

export const chatWithAgent = async (params: ChatRequest) => {
  return httpStream<ChatRequest>('/api/v1/chat/conversations', params);
};
