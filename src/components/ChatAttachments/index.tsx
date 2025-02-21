import { CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Modal, Tabs } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { MAX_ATTACHMENT_COUNT } from '@/constants';
import { DocFileInfo } from '@/services/chat/chatConversation';
import { TmpFileInfo } from '@/services/tmpfile/uploadTmpFile';
import DocumentFileSelect from './DocumentFileSelect';
import TempFileUpload from './TempFileUpload';

export interface ChatAttachmentsProps {
  onConfirm?: (files: {
    tmpFiles: TmpFileInfo[];
    docFiles: DocFileInfo[];
  }) => void;
}

export interface ChatAttachmentsRef {
  open: (params?: { maxCount?: number; tip?: string }) => void;
}

const ChatAttachments: React.ForwardRefRenderFunction<
  ChatAttachmentsRef,
  ChatAttachmentsProps
> = ({ onConfirm }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maxAttachmentCount, setMaxAttachmentCount] =
    useState(MAX_ATTACHMENT_COUNT);
  const [fileCount, setFileCount] = useState(0);
  const [tip, setTip] = useState('');
  const tmpFiles = useRef<TmpFileInfo[]>([]);
  const docFiles = useRef<DocFileInfo[]>([]);

  useImperativeHandle(ref, () => ({
    open: ({ maxCount, tip } = {}) => {
      if (maxCount) setMaxAttachmentCount(maxCount);
      if (tip) setTip(tip);
      setIsModalOpen(true);
    },
  }));

  const handleConfirm = () => {
    if (onConfirm)
      onConfirm({ tmpFiles: tmpFiles.current, docFiles: docFiles.current });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onTmpFileChange = (files: TmpFileInfo[]) => {
    tmpFiles.current = files;
    setFileCount(tmpFiles.current.length + docFiles.current.length);
  };

  const onDocSelectChange = (files: DocFileInfo[]) => {
    docFiles.current = files;
    setFileCount(tmpFiles.current.length + docFiles.current.length);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `上传本地文档(${tmpFiles.current.length})`,
      children: (
        <TempFileUpload
          disabled={fileCount >= maxAttachmentCount}
          onFileChange={onTmpFileChange}
          style={{ height: 480 }}
        />
      ),
    },
    {
      key: '2',
      label: `文库文档(${docFiles.current.length})`,
      children: (
        <DocumentFileSelect
          disabled={fileCount >= maxAttachmentCount}
          onDocSelectChange={onDocSelectChange}
          style={{ height: 480 }}
        />
      ),
    },
  ];

  const ActionBtns = (
    <div className="flex items-center gap-3">
      {tip && <span>{tip}</span>}
      <h3
        style={{ color: fileCount >= maxAttachmentCount ? '#EE4A4A' : '' }}
      >{`已选: ${fileCount}/${maxAttachmentCount}`}</h3>
      <Button
        type="primary"
        className="mr-[18px]"
        onClick={handleConfirm}
      >
        确认
      </Button>
      <CloseOutlined onClick={handleCancel} />
    </div>
  );

  return (
    <>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setIsModalOpen(true)}
      ></Button>

      <Modal
        width={940}
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          tabBarExtraContent={{
            right: ActionBtns,
          }}
        />
      </Modal>
    </>
  );
};

export default forwardRef(ChatAttachments);
