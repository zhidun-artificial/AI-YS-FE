import { httpStream } from '../http';
import { DocFileInfo } from './chatConversation';


interface ChatWithAssistantRequest {
  conversationId: string;
  query: string;
  assistantId: string;
  files?: DocFileInfo[];
}

export const chatWithAssistant = async (params: ChatWithAssistantRequest) => {
  return httpStream<ChatWithAssistantRequest>('/api/v1/chat/conversations/chat_with_assistant', params);
};
