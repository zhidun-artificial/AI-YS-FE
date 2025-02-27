import { httpPost } from '@/services/http';

export interface TmpFileInfo {
  url: string;
  id: string;
  fileName: string;
}

type UploadTmpFileRequest = FormData;

type UploadTmpFileResponse = Array<TmpFileInfo>;

export const uploadTmpFile = (params: File[]) => {
  const formData = new FormData();
  params.forEach((file) => {
    formData.append('files', file);
  });
  return httpPost<UploadTmpFileRequest, UploadTmpFileResponse>(
    '/api/v1/tmpfile',
    formData,
  );
};
