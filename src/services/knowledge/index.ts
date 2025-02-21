import { httpDelete, httpPost, httpPut } from '@/services/http';

interface KnowledgeRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type KnowledgeItem = {
  id: string;
  name: string;
  person: string;
  createTime: number;
  count: number;
  tag: string,
  remark: string;
};

interface KnowledgeResponse {
  records: KnowledgeItem[];
  total: number;
}

interface KnowledgeDetail {
  id: number;
  fileName: string;
}

export const getKnowledges = async (params: KnowledgeRequest) => {
  return httpPost<KnowledgeRequest, KnowledgeResponse>(
    '/api/v1/blocks/search',
    params,
  );
};

export const addKnowledges = async (params: { fileName: 'string' }) => {
  return httpPost<
    {
      fileName: 'string';
    },
    KnowledgeDetail
  >('/api/v1/blocks', params);
};

interface updateRequest {
  id: string | number;
  fileName: string;
}

export const updateKnowledge = async (params: updateRequest) => {
  return httpPut<updateRequest, KnowledgeDetail>(`/api/v1/blocks`, params);
};

export const deleteKnowledge = async (id: number) => {
  return httpDelete(`/api/v1/blocks/${id}`, {});
};
