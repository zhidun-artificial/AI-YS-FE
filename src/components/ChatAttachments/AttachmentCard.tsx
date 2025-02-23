import { EyeFilled, DownloadOutlined, CloseCircleFilled } from '@ant-design/icons';
import React from 'react';
import { IconPdfFile, IconWordFile } from './FileIcon';


interface AttachmentCardProps {
  info: {
    id: string;
    fileName: string;
    description?: string;
    url: string;
  };
  actions?: {
    onClose?: (info: AttachmentCardProps['info']) => void;
    onDownload?: (info: AttachmentCardProps['info']) => void;
    onView?: (info: AttachmentCardProps['info']) => void;
  },
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
  actions = {}
}) => {
  const { fileName, description } = info;
  const fileExtension = fileName.split('.').pop() || 'pdf';
  const { onClose, onDownload, onView } = actions;

  return (
    <div
      className="h-[54px] w-full flex flex-row gap-2 items-center group bg-[#F3F4F6] px-4 py-2 rounded-lg justify-between"
      style={styles?.container || {}}
    >
      <div className="w-6 h-full flex items-center justify-center">
        {iconMapForFileExtension[fileExtension]}
      </div>
      <div className="h-full w-1/2 flex-1 flex flex-col justify-center">
        <h3 className="text-[#4B5563] line-clamp-1">{decodeURIComponent(fileName)}</h3>
        {description && <p className="">{description}</p>}
      </div>
      <div className="h-full justify-center items-center flex flex-row gap-3">
        {onView && <EyeFilled
          className="invisible group-hover:visible hover:cursor-pointer"
          style={{ fontSize: 16, color: '#A1ABC2' }}
          onClick={() => onView?.(info)}>
        </EyeFilled>}
        {onDownload && <DownloadOutlined
          className="invisible group-hover:visible hover:cursor-pointer"
          style={{ fontSize: 16, color: '#A1ABC2' }}
          onClick={() => onDownload?.(info)}
        />}
        {onClose && <CloseCircleFilled
          className="invisible group-hover:visible hover:cursor-pointer"
          style={{ fontSize: 16, color: '#A1ABC2' }}
          onClick={() => onClose?.(info)}
        />}
      </div>
    </div>
  );
};

export default AttachmentCard;
