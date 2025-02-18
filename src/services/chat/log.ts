import { httpPost } from '@/services/http';

interface LogRequest {
  pageNo: number;
  pageSize: number;
}

export type LogItem = {
  id: number;
  name: string;
  createTime: string | number;
  conversationId: string;
  creator: number;
  creatorName: string;
  count: number;
  updateTime: number;
};

interface LogResponse {
  records: LogItem[];
  total: number;
}

export const getLogs = async (params: LogRequest) => {
  return httpPost<LogRequest, LogResponse>('/api/v1/oplogs/search', params);
};
