import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { IconPdfFile, IconWordFile } from './FileIcon';

interface AttachmentCardProps {
  info: {
    id: string;
    fileName: string;
    description?: string;
    url: string;
  };
  onClose?: (info: AttachmentCardProps['info']) => void;
  styles?: {
    container: React.CSSProperties;
  };
}

const iconMapForFileExtension: Record<string, React.ReactNode> = {
  pdf: <IconPdfFile style={{ fontSize: 30 }} />,
  doc: <IconWordFile style={{ fontSize: 30 }} />,
  docx: <IconWordFile style={{ fontSize: 30 }} />,
};

const AttachmentCard: React.FC<AttachmentCardProps> = ({
  info,
  styles,
  onClose,
}) => {
  const { fileName, description } = info;
  const fileExtension = fileName.split('.').pop() || 'pdf';

  return (
    <div
      className="h-[54px] w-full flex flex-row gap-2 items-center group bg-[#F7F8FA] px-4 py-2 rounded-lg justify-between"
      style={styles?.container || {}}
    >
      <div className="w-6 h-full flex items-center justify-center">
        {iconMapForFileExtension[fileExtension]}
      </div>
      <div className="h-full w-1/2 flex-1 flex flex-col justify-center">
        <h3 className="text-[#000614] line-clamp-1">{fileName}</h3>
        {description && <p className="">{description}</p>}
      </div>
      <div className="justify-center items-center w-6 flex">
        <CloseCircleOutlined
          className="hidden group-hover:block hover:cursor-pointer"
          style={{ fontSize: 24, color: '#A1ABC2' }}
          onClick={() => onClose?.(info)}
        />
      </div>
    </div>
  );
};

export default AttachmentCard;
