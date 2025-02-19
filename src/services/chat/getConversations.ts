import { httpGet } from '../http';

export interface ConversationInfo {
  id: string;
  name: string;
  inputs: Record<string, string>;
  status: string;
  introduction: string;
  createdAt: number;
  updatedAt: number;
}

interface GetConversationsRequest {
  lastId?: string;
  limit?: number;
  sort?:
    | 'CREATED_AT_ASC'
    | 'CREATED_AT_DESC'
    | 'UPDATED_AT_ASC'
    | 'UPDATED_AT_DESC';
}

interface GetConversationsResponse {
  limit: number;
  hasMore: boolean;
  data: ConversationInfo[];
}

export const getConversations = (params?: GetConversationsRequest) =>
  httpGet<GetConversationsRequest, GetConversationsResponse>(
    '/api/v1/chat/conversations',
    params || {},
  );
