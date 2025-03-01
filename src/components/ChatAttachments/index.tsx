import { CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Modal, Tabs } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { MAX_ATTACHMENT_COUNT, MAX_UPLOAD_SIZE } from '@/constants';
import { TmpFileInfo, uploadTmpFile } from '@/services/tmpfile/uploadTmpFile';
import FileUpload, { FileUploadProps } from './FileUpload';


export interface ChatAttachmentsProps {
  onConfirm?: (files: {
    tmpFiles: TmpFileInfo[]
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

  useImperativeHandle(ref, () => ({
    open: ({ maxCount, tip } = {}) => {
      if (maxCount) setMaxAttachmentCount(maxCount);
      if (tip) setTip(tip);
      setIsModalOpen(true);
    },
  }));

  const handleConfirm = () => {
    if (onConfirm)
      onConfirm({ tmpFiles: tmpFiles.current });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onTmpFileChange: FileUploadProps['onFileChange'] = (mode, files) => {
    if (mode === 'add') {
      tmpFiles.current = [...tmpFiles.current, ...files];
    }
    if (mode === 'remove') {
      tmpFiles.current = tmpFiles.current.filter((file) => !files.some((f) => f.id === file.id));
    }
    setFileCount(tmpFiles.current.length);
  };

  const uploadFn = useCallback(async (file: File) => {
    const res = await uploadTmpFile([file]);
    if (res instanceof Error) {
      return res;
    } else {
      if (res.code === 0) {
        return res.data[0];
      } else {
        return new Error(res.msg);
      }
    }
  }, []);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `上传本地文档(${tmpFiles.current.length})`,
      children: (
        <FileUpload
          style={{ height: 480 }}
          maxFiles={maxAttachmentCount}
          maxSize={MAX_UPLOAD_SIZE}
          disabled={fileCount >= maxAttachmentCount}
          uploadFn={uploadFn}
          onFileChange={onTmpFileChange}>
        </FileUpload>
      ),
    }
  ];

  const ActionBtns = (
    <div className="flex items-center flex-row gap-3">
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
