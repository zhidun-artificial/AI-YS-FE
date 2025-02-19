import { httpPost } from '@/services/http';

export interface LibraryItem {
  id: string | number;
  name: string;
  creator: string;
  createTime: string;
  docCount: number;
}

interface CreateLibrariesRequest {
  name: string;
}

type CreateLibraryResponse = LibraryItem;

// 创建文库
export async function createLibrary(params: { name: string }) {
  return httpPost<CreateLibrariesRequest, CreateLibraryResponse>(
    '/api/v1/libraries',
    params,
  );
}
