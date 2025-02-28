import { TmpFileInfo } from '@/services/tmpfile/uploadTmpFile';
import { Empty, List, message, Typography } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';
import { v4 as uuid } from 'uuid';
import EmptyFileImg from '@/assets/images/empty-file.png';
import AttachmentCard from './AttachmentCard';
import { useTheme } from 'antd-style';

const UPLOAD_ERROR_MESSAGE = {
  'file-invalid-type': '文件格式不支持',
  'file-too-large': '文件过大',
  'file-too-small': '文件过小',
} as const

type UploadErrorCode = keyof typeof UPLOAD_ERROR_MESSAGE


export interface FileUploadProps extends DropzoneOptions {
  style?: React.CSSProperties;
  disabled?: boolean;
  onFileChange?: (change: 'add' | 'remove', files: TmpFileInfo[]) => void;
  uploadFn: (file: File) => Promise<TmpFileInfo | Error>;
}


interface UploadFile extends TmpFileInfo {
  uploadId: number | string
  status: "loading" | "success" | "error"
}


const FileUpload: React.FC<FileUploadProps> = ({ style, uploadFn, disabled, maxFiles = 10, onFileChange, ...props }) => {
  const [uploadFiles, setUploadFiles] = useState<Array<UploadFile>>([]);

  const { colorPrimaryBg, colorPrimaryBorder } = useTheme()

  const successUploadCount = useMemo(() => {
    return uploadFiles.filter(f => f.status === 'success').length
  }, [uploadFiles])


  const onDropRejected: DropzoneOptions['onDropRejected'] = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 2) {
      message.error('最多上传两个文件')
    } else {
      const failFiles = rejectedFiles.map((file) => ({ uploadId: uuid(), id: file.file.name, fileName: file.file.name, url: '', status: 'error' as const, description: file.errors.map((error) => UPLOAD_ERROR_MESSAGE[error.code as UploadErrorCode]).join(',') }))
      setUploadFiles((preFiles) => ([...preFiles, ...failFiles]))
    }
  }, [])


  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback((acceptedFiles: File[]) => {
    if (successUploadCount + acceptedFiles.length > maxFiles) {
      message.error(`最多上传${maxFiles}个文件`);
      return;
    }

    const newUploadFiles = acceptedFiles.map((file) => ({
      uploadId: uuid(),
      id: file.name,
      fileName: file.name,
      url: '',
      status: 'loading' as const
    }));

    setUploadFiles(prevFiles => [...prevFiles, ...newUploadFiles]);

    const uploadTasks = newUploadFiles.map(async (fileInfo) => {
      try {
        const result = await uploadFn(acceptedFiles.find(f => f.name === fileInfo.fileName)!);

        if (result instanceof Error) {
          setUploadFiles(prevFiles =>
            prevFiles.map(item =>
              item.uploadId === fileInfo.uploadId
                ? { ...item, status: 'error' as const, description: result.message }
                : item
            )
          );
          return null;
        }

        setUploadFiles(prevFiles =>
          prevFiles.map(item =>
            item.uploadId === fileInfo.uploadId
              ? { ...item, status: 'success' as const, ...result }
              : item
          )
        );
        return result;
      } catch (err) {
        setUploadFiles(prevFiles =>
          prevFiles.map(item =>
            item.uploadId === fileInfo.uploadId
              ? { ...item, status: 'error' as const, description: '上传失败' }
              : item
          )
        );
        return null;
      }
    });

    Promise.all(uploadTasks).then(results => {
      const successFiles = results.filter(Boolean) as TmpFileInfo[];
      if (onFileChange && successFiles.length > 0) {
        onFileChange('add', successFiles);
      }
    });
  }, [successUploadCount, maxFiles, uploadFn, onFileChange]);

  const onError = useCallback((error: Error) => {
    console.error('error', error)
  }, [])

  const onDeleteFile = useCallback((file: UploadFile) => {
    setUploadFiles((prevFiles) => {
      const newFiles = prevFiles.filter(f => f.uploadId !== file.uploadId);
      return newFiles;
    });
    if (onFileChange) onFileChange('remove', [file]);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles,
    maxSize: 6 * 1024 * 1024,
    onDropAccepted,
    onDropRejected,
    onError,
    ...props
  })


  const EmptyPlaceholder = (
    <Empty
      image={EmptyFileImg}
      className="flex flex-col items-center h-[290px] justify-center"
      description={
        <Typography.Text type="secondary" className="text-sm text-[#A1ABC2]">
          暂无上传文档
        </Typography.Text>
      }
    ></Empty>
  );

  return (
    <div style={style} className="relative bg-white p-2" >
      {uploadFiles.length > 0 ? <List
        className="h-[300px] flex-1 overflow-auto"
        grid={{ gutter: 16, column: 3 }}
        dataSource={uploadFiles}
        renderItem={(item) => (
          <List.Item>
            <AttachmentCard
              info={item}
              status={item.status}
              actions={{
                onClose: () => onDeleteFile(item)
              }}
            >
            </AttachmentCard>
          </List.Item>
        )}
      ></List> : EmptyPlaceholder
      }
      <div {...getRootProps({
        style: isDragAccept ? { borderStyle: 'dashed', backgroundColor: colorPrimaryBg, borderColor: colorPrimaryBorder } : {}
      })} className={`relative h-[180px] w-full flex-0 flex items-center justify-center flex-col border-2 border-solid bg-bg border-border cursor-pointer hover:bg-bg-hover hover:border-border-hover`}>
        <input {...getInputProps({ disabled })} />
        <Typography.Text className="mb-4">点击上传或拖入文档</Typography.Text>
        <Typography.Text className="">
          {`最多可上传${maxFiles}个文件，文档大小不超过200MB，支持：doc、docx、pdf`}
        </Typography.Text>
      </div>
    </div>
  );
};

export default FileUpload;
