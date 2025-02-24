import { httpDelete, httpPost, httpPut } from '@/services/http';

export interface KnowledgeRequest {
  key: string;
  pageNo: number;
  pageSize: number;
  sort?: string
}

export type KnowledgeItem = {
  "id"?: string,
  "name":string,
  "creator"?: string,
  "creatorName"?: string,
  "docCount": number,
  "ext": {
    tag?: string,
    remark?: string
  },
  "createTime"?: number,
  "updateTime"?: number
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
    '/api/v1/knowledge_base/search',
    params,
  );
};

export const addKnowledges = async (params: { fileName: 'string' }) => {
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

export const updateKnowledge = async (params: updateRequest) => {
  return httpPut<updateRequest, KnowledgeDetail>(`/api/v1/knowledge_base`, params);
};

export const deleteKnowledge = async (id: number) => {
  return httpDelete(`/api/v1/knowledge_base/${id}`, {});
};
