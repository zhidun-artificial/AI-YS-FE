import EmptyFile from '@/assets/images/empty-file.png';
import { TmpFileInfo, uploadTmpFile } from '@/services/tmpfile/uploadTmpFile';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Empty, List, message, Typography, Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import React, { useRef, useState } from 'react';
import AttachmentCard from './AttachmentCard';

interface TempFileUploadProps {
  style?: React.CSSProperties;
  disabled?: boolean;
  onFileChange?: (files: TmpFileInfo[]) => void;
}

const TempFileUpload: React.FC<TempFileUploadProps> = ({
  style,
  onFileChange,
  disabled,
}) => {
  const [tmpFiles, setTmpFiles] = useState<TmpFileInfo[]>([]);
  const uploadFiles = useRef<
    Array<RcFile & { status: string; info?: TmpFileInfo }>
  >([]);
  // const [fileStatus, setFileStatus] = useState<Array<RcFile & { status: string, info?: TmpFileInfo }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const updateUploadStatus = (
    file: RcFile,
    status: string,
    updateInfo?: TmpFileInfo,
  ) => {
    const newFile = uploadFiles.current.find((item) => item.uid === file.uid);
    if (newFile) {
      newFile.status = status;
      newFile.info = updateInfo;
    }
    // setFileStatus(() => [...uploadFiles.current]);
    if (
      uploadFiles.current.every(
        (item) => item.status === 'done' || item.status === 'error',
      )
    ) {
      setIsUploading(false);
      const finishedFiles = uploadFiles.current
        .filter((item) => item.info !== undefined)
        .map((item) => item.info) as TmpFileInfo[];
      setTmpFiles(finishedFiles);
      if (onFileChange) onFileChange(finishedFiles);
    }
  };

  const onUploadFile: UploadProps['beforeUpload'] = async (file) => {
    if (
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].indexOf(file.type) === -1
    ) {
      message.error('文件格式不支持');
      return Upload.LIST_IGNORE;
    }

    if (file.size > 200 * 1024 * 1024) {
      message.error('文件大小超过200MB');
      return Upload.LIST_IGNORE;
    }

    uploadFiles.current = [
      ...uploadFiles.current,
      { ...file, status: 'uploading' },
    ];

    setIsUploading(true);
    const res = await uploadTmpFile([file]);

    if (res instanceof Error) {
      updateUploadStatus(file, 'error');
      return Upload.LIST_IGNORE;
    }
    if (res.code === 0) {
      const newFile = { ...res.data[0] };
      updateUploadStatus(file, 'done', newFile);
      return file;
    }
    message.error(res.msg);
    updateUploadStatus(file, 'error');
    return Upload.LIST_IGNORE;
  };

  const onDeleteFile = (file: TmpFileInfo) => {
    const newFiles = tmpFiles.filter((item) => item.id !== file.id);
    setTmpFiles(newFiles);
    if (onFileChange) onFileChange(newFiles);
  };

  const LoadingPlaceholder = (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex flex-col justify-center items-center z-40 bg-black opacity-60">
      <Loading3QuartersOutlined className="text-[#A1ABC2] animate-spin" />
      <span className="text-[#A1ABC2]">上传中...</span>
      {/* {
        fileStatus.map((file) => (
          <div key={file.uid} className='flex flex-row gap-2 justify-between px-4'>
            <span>{file.name}</span>
            <span>{file.status}</span>
          </div>
        ))
      } */}
    </div>
  );

  const EmptyPlaceholder = (
    <Empty
      image={EmptyFile}
      className="flex flex-col items-center h-[290px] justify-center"
      description={
        <Typography.Text type="secondary" className="text-sm text-[#A1ABC2]">
          暂无上传文档
        </Typography.Text>
      }
    ></Empty>
  );

  return (
    <div style={style} className="relative">
      {tmpFiles.length > 0 ? (
        <List
          className="h-[290px] overflow-auto"
          grid={{ gutter: 16, column: 3 }}
          dataSource={tmpFiles}
          renderItem={(item) => (
            <List.Item>
              <AttachmentCard
                info={item}
                onClose={onDeleteFile}
              ></AttachmentCard>
            </List.Item>
          )}
        />
      ) : (
        EmptyPlaceholder
      )}
      {isUploading && LoadingPlaceholder}
      <Dragger
        disabled={disabled}
        className="h-[180px] inline-block w-full bg-[#F4F5FE]"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={true}
        showUploadList={false}
        beforeUpload={onUploadFile}
        customRequest={() => false}
      >
        <p className="ant-upload-text !mb-4">点击上传或拖入文档</p>
        <p className="ant-upload-hint">
          最多可上传10个文件，文档大小不超过200MB，支持：doc、docx、pdf
        </p>
      </Dragger>
    </div>
  );
};

export default TempFileUpload;
