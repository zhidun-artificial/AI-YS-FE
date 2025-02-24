import { ApiResponse } from '@/services/http';
import { TmpFileInfo } from '@/services/tmpfile/uploadTmpFile';
import { message } from 'antd';
import { uniqueId } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';


const UPLOAD_ERROR_MESSAGE = {
  'file-invalid-type': '文件格式不支持',
  'file-too-large': '文件过大',
  'file-too-small': '文件过小',
}

type UploadErrorCode = keyof typeof UPLOAD_ERROR_MESSAGE


export interface FileUploadProps {
  style?: React.CSSProperties;
  disabled?: boolean;
  onFileChange?: (files: TmpFileInfo[]) => void;
  uploadFn: (file: File) => Promise<ApiResponse<TmpFileInfo> | Error>;
}


interface UploadFile extends TmpFileInfo {
  uploadId: number | string
  status: "loading" | "success" | "error"
}


const FileUpload: React.FC<FileUploadProps> = ({ style, uploadFn }) => {
  const [uploadFiles, setUploadFiles] = useState<Array<UploadFile>>([]);

  const successUploadCount = useMemo(() => {
    return uploadFiles.filter(f => f.status === 'success').length
  }, [uploadFiles])

  const onDrop: DropzoneOptions['onDrop'] = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, [])

  const onDropRejected: DropzoneOptions['onDropRejected'] = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 2) {
      message.error('最多上传两个文件')
    } else {
      const failFiles = rejectedFiles.map((file) => ({ uploadId: uniqueId('fail'), id: file.file.name, fileName: file.file.name, url: '', status: 'error' as const, description: file.errors.map((error) => UPLOAD_ERROR_MESSAGE[error.code as UploadErrorCode]).join(',') }))
      setUploadFiles((preFiles) => ([...preFiles, ...failFiles]))
    }
  }, [])

  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    if (successUploadCount + acceptedFiles.length > 2) {
      message.error('最多上传两个文件')
      return;
    }
    const uploadTasks = acceptedFiles.map((file) => new Promise<boolean>((resolve) => {
      const uploadId = uniqueId('upload');
      setUploadFiles((preFiles) => ([...preFiles, { uploadId: uploadId, id: file.name, fileName: file.name, url: '', status: 'loading' as const }]))
      uploadFn(file).then(ret => {
        if (ret instanceof Error) {
          setUploadFiles((preFiles) => preFiles.map((item) => item.uploadId === uploadId ? { ...item, status: 'error', description: ret.message } : item))
          resolve(false);
        } else {
          if (ret.code === 0) {
            setUploadFiles((preFiles) => preFiles.map((item) => item.uploadId === uploadId ? { ...item, status: 'success', ...ret } : item))
            resolve(true);
          } else {
            setUploadFiles((preFiles) => preFiles.map((item) => item.uploadId === uploadId ? { ...item, status: 'error', description: ret.msg } : item))
            resolve(false);
          }
        }
      });
    }))
    Promise.all(uploadTasks).finally(() => {
      console.log(uploadFiles)
    })

  }, [uploadFiles])

  const onError = useCallback((error: Error) => {
    console.error('error', error)
  }, [])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 2,
    maxSize: 6 * 1024 * 1024,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onError
  })

  console.log(uploadFiles);
  return (
    <div {...getRootProps({ style, className: "relative" })}>
      <input {...getInputProps()} />
      <h1>上传{uploadFiles.length}个文件</h1>
      <h1>成功上传{successUploadCount}个文件</h1>
      <div>
        {uploadFiles.map((file) => (
          <div key={file.uploadId} className="flex items-center">
            {file.status === 'loading' ? <span>loading...</span> : file.status === 'success' ? <span>success</span> : <span>{file.description}</span>}
            <span>{file.fileName}</span>
          </div>
        ))}
      </div>
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
    </div>
  );
};

export default FileUpload;
