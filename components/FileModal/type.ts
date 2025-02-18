export interface FileType {
  name: string;
  type?: string;
  status: 'uploading' | 'success';
}
