import { httpDelete, httpPost, httpPut } from '@/services/http';

export interface DocumentRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type DocumentItem = {
  "id": string,
  "baseId": string,
  "title": string,
  "fileName": string,
  "url": string,
  "creator": string,
  "creatorName": string,
  "blockedReason": string,
  "createTime": number,
  "updateTime": number
};

interface DocumentResponse {
  records: DocumentItem[];
  total: number;
}

interface DocumentUpload {
  baseId: string;
  files: File[];
}



export const getDocuments = async (params: DocumentRequest) => {
  return httpPost<DocumentRequest, DocumentResponse>(
    '/api/v1/documents/search',
    params,
  );
};

export const addDocuments = async (params: DocumentUpload) => {
  return httpPost(`/api/v1/documents/upload?baseId=${params.baseId}`, params);
};

interface updateRequest {
  id: string;
  name: string;
}

export const updateDocument = async (params: updateRequest) => {
  return httpPut(`/api/v1/documents/${params.id}/rename?name=${params.name}`, {});
};

export const deleteDocument = async (id: string) => {
  return httpDelete(`/api/v1/documents/${id}`, {});
};


export const batchDeleteDocument = async (ids: string[]) => {
  return httpPost(`/api/v1/documents/batch_delete`, { ids });
};  
