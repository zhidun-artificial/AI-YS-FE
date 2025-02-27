import { httpPost } from '../http';

export type HistoryMessage = {
  id: string;
  conversationId: string;
  query: string;
  inputs: {
    files: Array<{
      dify_model_identity: '__dify__file__';
      id: number;
      tenant_id: string;
      type: string;
      transfer_method: string;
      remote_url: string;
      related_id: number;
      filename: string;
      extension: string;
      mime_type: string;
      size: number;
    }>;
  };
  answer: string;
  createdAt: number;
  updatedAt: number;
};

interface GetMessagesRequest {
  conversationId: string;
  pageNo?: number;
  pageSize?: number;
  sort?:
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';
}

interface GetMessagesResponse {
  pageNo: number;
  pageSize: number;
  total: number;
  records: HistoryMessage[];
}

export const getHistoryMessages = async (params: GetMessagesRequest) =>
  httpPost<GetMessagesRequest, GetMessagesResponse>(
    `/api/v1/chat/conversations/messages/search`,
    params,
  );
