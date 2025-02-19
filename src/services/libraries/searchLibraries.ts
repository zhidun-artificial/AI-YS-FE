import { httpDelete, httpPost, httpPut } from '@/services/http';
import { LibraryItem } from './createLibrary';

export interface SearchLibrariesRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

interface SearchLibrariesResponse {
  records: LibraryItem[];
  total: number;
}

// 获取文库列表
export async function searchLibraries(params: SearchLibrariesRequest) {
  return httpPost<SearchLibrariesRequest, SearchLibrariesResponse>(
    '/api/v1/libraries/search',
    params,
  );
}

export const deleteLibrarie = async (id: number) => {
  return httpDelete(`/api/v1/libraries/${id}`, {});
};

export const updateLibrarie = async (params: { id: number; name: string }) => {
  return httpPut(`/api/v1/libraries`, params);
};
