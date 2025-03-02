import { httpDelete, httpPost, httpPut } from '@/services/http';

interface SensitiveRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type SensitiveItem = {
  id: number;
  value: string;
  enabled: boolean;
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
    '/api/v1/blocked_words/search',
    params,
  );
};

export const addSensitives = async (params: { value: 'string' }) => {
  return httpPost<
    {
      value: 'string';
    },
    SensitiveDetail
  >('/api/v1/blocked_words', params);
};

interface updateRequest {
  id: string | number;
  value: string;
}

export const updateSensitive = async (params: updateRequest) => {
  return httpPut<updateRequest, SensitiveDetail>(
    `/api/v1/blocked_words`,
    params,
  );
};

export const deleteSensitive = async (id: number) => {
  return httpDelete(`/api/v1/blocked_words/${id}`, {});
};

export const disableSensitive = async (id: number) => {
  return httpDelete(`/api/v1/blocked_words/${id}/disable`, {});
};

export const enableSensitive = async (id: number) => {
  return httpDelete(`/api/v1/blocked_words/${id}/enable`, {});
};
