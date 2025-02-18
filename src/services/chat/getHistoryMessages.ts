import { httpGet } from '../http';

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
  id: string;
  firstId?: string;
  limit?: number;
}

interface GetMessagesResponse {
  limit: number;
  hasMore: boolean;
  data: HistoryMessage[];
}

export const getHistoryMessages = async (params: GetMessagesRequest) =>
  httpGet<GetMessagesRequest, GetMessagesResponse>(
    `/api/v1/chat/conversations/${params.id}/messages`,
    params,
  );
