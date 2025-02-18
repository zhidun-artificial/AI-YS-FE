import { httpDelete, httpPost, httpPut } from '@/services/http';

export interface DocItem {
  id: number;
  title: string;
  libraryId: number;
  fileName: string;
  url: string;
  showUrl: string;
  rawUrl: string;
  creator: string | number;
  blockedReason: string;
  createTime: string | number;
  coverUrl: string | null;
}

export interface renameParams {
  id: number;
  name: string;
}

interface SearchDocumentsRequest {
  key?: string;
  libraryId: string | number;
  pageNo: number;
  pageSize: number;
}

interface SearchDocumentsResponse {
  total: number;
  records: DocItem[];
}

export async function searchDocuments(params: SearchDocumentsRequest) {
  return httpPost<SearchDocumentsRequest, SearchDocumentsResponse>(
    '/api/v1/documents/search',
    params,
  );
}

export async function renameDocument(params: renameParams) {
  return httpPut<undefined, unknown>(
    `/api/v1/documents/${params.id}/rename?name=${params.name}`,
    undefined,
  );
}

export async function deleteDocument(id: number) {
  return httpDelete(`/api/v1/documents/${id}`, {});
}
