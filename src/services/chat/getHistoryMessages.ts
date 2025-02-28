import { ResourceInfo } from '@/components/ChatViewer/adapter';
import { httpPost } from '../http';
import { TmpFileInfo } from '../tmpfile/uploadTmpFile';

export type HistoryMessage = {
  id: string;
  conversationId: string;
  query: string;
  answer: string;
  files: {
    resources: ResourceInfo[];
    files: TmpFileInfo[];
  }
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
