import { httpPost } from "../http";

type uploadFileRequest = FormData;

export interface UploadFileResponse {
  saved: Array<{
    id: string;
    baseId: string;
    title: string;
    fileName: string;
    status: number;
    url: string;
    creator: string;
    creatorName: string;
    blockedReason: string;
    createTime: number;
    updateTime: number;
  }>;
  unknowns: Array<{
    fileName: string;
    contentType: string;
  }>;
}

export interface UploadDocParams {
  baseId: string;
  files: File[];
}


export const uploadDocFile = async (params: UploadDocParams) => {
  const { files = [], baseId } = params
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return httpPost<uploadFileRequest, UploadFileResponse>(
    `/api/v1/documents/upload?baseId=${baseId}`,
    formData,
  );
}