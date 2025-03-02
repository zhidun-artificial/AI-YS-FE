import { httpDelete, httpPost, httpPut, httpGet } from '@/services/http';

export interface KnowledgeRequest {
  key: string;
  pageNo: number;
  pageSize: number;
  sort?: string
}

export type KnowledgeItem = {
  id?: string;
  name: string;
  creator: string;
  creatorName: string;
  docCount?: number;
  embedModel: string;
  description: string;
  tags: string[];
  permit?: 1 | 0;
  groupId: string,
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


export const getKnowledgeBases = async (params: KnowledgeRequest) => {
  return httpPost<KnowledgeRequest, KnowledgeResponse>(
    '/api/v1/knowledge_base/search',
    params,
  );
};

// export const getKnowledgeBases = async (params: KnowledgeRequest) => {
//   return httpPost<KnowledgeRequest, KnowledgeResponse>(
//     '/api/v1/knowledge_base/search',
//     params,
//   );
// };

export const addKnowledgeBase = async (params: KnowledgeItem) => {
  return httpPost<
    KnowledgeItem
  >('/api/v1/knowledge_base', params);
};


export const updateKnowledgeBase = async (params: KnowledgeItem) => {
  return httpPut<KnowledgeItem>(`/api/v1/knowledge_base`, params);
};

export const deleteKnowledgeBase = async (id: number) => {
  return httpDelete(`/api/v1/knowledge_base/${id}`, {});
};


// interface TagsResponse {
//   data: string[]
// }
interface TagsRequest {
  id?: string
}

export const getTags = async () => {
  return httpGet<TagsRequest, string[]>(
    '/api/v1/knowledge_base/tags', {}
  );
}
