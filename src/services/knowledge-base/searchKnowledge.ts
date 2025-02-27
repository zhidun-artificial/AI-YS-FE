import { httpPost } from "../http";

interface SearchKnowledgeRequest {
  key?: string;
  pageNo?: number;
  pageSize?: number;
  sort?:
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';
}

interface KnowledgeBaseInfo {
  id: string;
  name: string;
  creator: string;
  creatorName: string;
  docCount: number;
  ext: Record<string, unknown>;
  createTime: number;
  updateTime: number;
}

interface SearchKnowledgeResponse {
  pageNo: number
  pageSize: number
  records: KnowledgeBaseInfo[]
  total: number
}


export const searchKnowledgeBase = (params?: SearchKnowledgeRequest) =>
  httpPost<SearchKnowledgeRequest, SearchKnowledgeResponse>(
    '/api/v1/knowledge_base/search',
    params || {},
  );