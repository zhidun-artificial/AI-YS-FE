import { httpDelete, httpPost, httpPut } from '@/services/http';

interface SensitiveRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type SensitiveItem = {
  id: number;
  blockedWord: string;
  name: string;
  remarks: string;
  createTime: string;
};

interface SensitiveResponse {
  records: SensitiveItem[];
  total: number;
}

interface SensitiveDetail {
  id: number;
  blockedWord: string;
}

export const getSensitives = async (params: SensitiveRequest) => {
  return httpPost<SensitiveRequest, SensitiveResponse>(
    '/api/v1/blocks/search',
    params,
  );
};

export const addSensitives = async (params: { blockedWord: 'string' }) => {
  return httpPost<
    {
      blockedWord: 'string';
    },
    SensitiveDetail
  >('/api/v1/blocks', params);
};

interface updateRequest {
  id: string | number;
  blockedWord: string;
}

export const updateSensitive = async (params: updateRequest) => {
  return httpPut<updateRequest, SensitiveDetail>(`/api/v1/blocks`, params);
};

export const deleteSensitive = async (id: number) => {
  return httpDelete(`/api/v1/blocks/${id}`, {});
};
