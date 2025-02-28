import { httpDelete, httpPost, httpPut } from '@/services/http';

export interface KnowledgeRequest {
  key: string;
  pageNo: number;
  pageSize: number;
  sort?: string
}

export type KnowledgeItem = {
  id: string;
  name: string;
  creator: string;
  creatorName: string;
  docCount: number;
  ext: Record<string, unknown>;
  createTime: number;
  updateTime: number;
};

interface KnowledgeResponse {
  pageNo: number
  pageSize: number
  records: KnowledgeItem[]
  total: number
}

interface KnowledgeDetail {
  id: number;
  fileName: string;
}

export const getKnowledgeBases = async (params: KnowledgeRequest) => {
  return httpPost<KnowledgeRequest, KnowledgeResponse>(
    '/api/v1/knowledge_base/search',
    params,
  );
};

export const addKnowledgeBase = async (params: { fileName: 'string' }) => {
  return httpPost<
    {
      fileName: 'string';
    },
    KnowledgeDetail
  >('/api/v1/knowledge_base', params);
};

interface updateRequest {
  id: string | number;
  fileName: string;
}

export const updateKnowledgeBase = async (params: updateRequest) => {
  return httpPut<updateRequest, KnowledgeDetail>(`/api/v1/knowledge_base`, params);
};

export const deleteKnowledgeBase = async (id: number) => {
  return httpDelete(`/api/v1/knowledge_base/${id}`, {});
};
