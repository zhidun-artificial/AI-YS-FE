import { httpDelete, httpPost, httpPut } from '@/services/http';

export interface AgenteRequest {
  key: string;
  pageNo: number;
  pageSize: number;
  sort?: string
}

export type AgenteItem = {
  "id"?: string,
  "name": string,
  "llmModel": string,
  "systemPrompt": string,
  "permit": number,
  "description": string,
  "baseIds": string[],  // string
  "creator": string,
  "ext": object
};

interface AgenteResponse {
  records: AgenteItem[];
  total: number;
}

interface AgenteDetail {
  "id"?: string,
  "name": string,
  "llmModel": string,
  "systemPrompt": string,
  "permit": number,
  "description": string,
  "baseIds": string[],  // string
  "creator": string,
  "ext": object
}

export const getAgentes = async (params: AgenteRequest) => {
  return httpPost<AgenteRequest, AgenteResponse>(
    '/api/v1/assistants/search',
    params,
  );
};

export const addAgentes = async (params: AgenteItem) => {
  return httpPost<
    AgenteDetail
  >('/api/v1/assistants', params);
};

interface updateRequest {
  id: string | number;
  name: string;
}

export const updateAgente = async (params: updateRequest) => {
  return httpPut<updateRequest, AgenteDetail>(`/api/v1/assistants`, params);
};

export const deleteAgente = async (id: number) => {
  return httpDelete(`/api/v1/assistants/${id}`, {});
};
