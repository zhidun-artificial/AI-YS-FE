import { TmpFileInfo } from '@/services/tmpfile/uploadTmpFile';
import { v4 as uuid } from 'uuid';

export interface ResourceInfo {
  documentId: string;
  fileName: string;
  url: string;
}

export type SSEReceiveData = {
  event: 'partial_message';
  conversationId: string;
  text: string;
} | {
  event: 'rag';
  conversationId: string;
  ctx: {
    resources: Array<ResourceInfo>;
    files: Array<TmpFileInfo>;
  }
} | {
  event: 'finished';
  conversationId: string;
  metadata: Record<string, unknown>;
}

export interface MessageData {
  id: string;
  conversationId: string;
  content: string;
  ctx?: {
    resources?: Array<ResourceInfo>;
    files?: Array<TmpFileInfo>;
  }
  meta?: Record<string, unknown>;
  event?: SSEReceiveData['event'];
  type: 'query' | 'answer' | 'fullAnswer' | 'files';
}

export const convertMessage = (data?: string): MessageData | false => {
  if (!data) return false;
  try {
    const message = JSON.parse(data) as SSEReceiveData;
    if (message.event === 'partial_message')
      return {
        type: 'answer',
        event: message.event,
        id: uuid(),
        conversationId: message.conversationId,
        content: message.text,
        ctx: {
          resources: [],
          files: []
        }
      };
    if (message.event === 'rag') return {
      type: "files",
      event: message.event,
      id: uuid(),
      conversationId: message.conversationId,
      content: '',
      ctx: message.ctx
    };
    return false;
  } catch {
    return false;
  }
};
