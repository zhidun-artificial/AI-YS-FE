import { httpDelete, httpPost, httpPut, httpGet } from '@/services/http';

export interface AgenteRequest {
  key: string;
  pageNo: number;
  pageSize: number;
  sort?: string;
  forEdit: boolean;
}

export type AgenteItem = {
  "id"?: string,
  "name": string,
  "llmModel": string,
  "systemPrompt": string,
  "permit": 1 | 0,
  "description": string,
  "baseIds": string[],  // string
  "creator": string,
  "ext": object,
};

interface AgenteResponse {
  records: never[];
  code: number;
  data: {
    records: AgenteItem[];
    total: number;
  },
  msg: string;
}

interface AgenteDetail {
  "id"?: string,
  "name": string,
  "llmModel": string,
  "systemPrompt": string,
  "permit": 1 | 0,
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
interface ModelsResponse {
  "embeddings": string[],
  "llm": string[]
}
interface ModelsRequest {
  id?: string
}
export const updateAgente = async (params: updateRequest) => {
  return httpPut<updateRequest, AgenteDetail>(`/api/v1/assistants`, params);
};

export const deleteAgente = async (id: number) => {
  return httpDelete(`/api/v1/assistants/${id}`, {});
};

export const getModels = async () => {
  return httpGet<ModelsRequest, ModelsResponse>(
    '/api/v1/models/show', {}
  );
}