import { httpPost } from '../http';

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
  key?: string;
  pageNo?: number;
  pageSize?: number;
  sort?:
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';
}

interface GetConversationsResponse {
  pageNo: number
  pageSize: number
  records: ConversationInfo[]
  total: number
}

export const getConversations = (params?: GetConversationsRequest) =>
  httpPost<GetConversationsRequest, GetConversationsResponse>(
    '/api/v1/chat/conversations/search',
    params || {},
  );
