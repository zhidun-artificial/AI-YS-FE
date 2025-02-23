import { DocFileInfo } from '@/services/chat/chatConversation';

export interface SSEReceiveData {
  event: 'message' | 'message_end' | 'tts_message_end';
  conversationId: string;
  messageId: string;
  createdAt: number;
  taskId: string;
  answer: string;
}

export interface MessageData {
  id: string;
  conversationId: string;
  content: string;
  tempFiles?: DocFileInfo[];
  docFiles?: DocFileInfo[];
  type: 'query' | 'answer' | 'fullAnswer' | 'files';
}

export const convertMessage = (data?: string): MessageData | false => {
  if (!data) return false;
  try {
    const message = JSON.parse(data) as SSEReceiveData;
    if (message.event === 'message')
      return {
        type: 'answer',
        id: message.messageId,
        conversationId: message.conversationId,
        content: message.answer,
        tempFiles: [],
        docFiles: [],
      };
    return false;
  } catch {
    return false;
  }
};
