import { Loading3QuartersOutlined } from '@ant-design/icons';
import React from 'react';

interface FileCardProps {
  imgSrc: string;
  name: string;
  status: 'uploading' | 'success';
}

const FileCard: React.FC<FileCardProps> = ({ imgSrc, name, status }) => {
  const LoadingPlaceholder = (
    <div className="absolute top-0 left-2 bottom-0 right-2 flex flex-col justify-center items-center z-40 bg-black opacity-60 rounded-[8px]">
      <Loading3QuartersOutlined className="text-[#A1ABC2] animate-spin" />
      <span className="text-[#A1ABC2]">上传中...</span>
    </div>
  );
  return (
    <div className="w-[286px] h-[52px] flex items-center bg-[#F7F8FA] rounded-[8px] pl-4">
      {status === 'uploading' && LoadingPlaceholder}
      <img src={imgSrc} alt={name} className="mr-[10px] h-[30px] w-[30px]" />
      <span className="w-[230px] truncate">{name}</span>
    </div>
  );
};

export default FileCard;
