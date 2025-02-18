import { CloseOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Button, Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import CloudFile from './cloudFile';
import LocalFile from './localFile';
import type { FileType } from './type';

const files: FileType[] = [
  {
    name: '第四次工业革命主要成果展示',
  },
  {
    name: '第四次工业革命主要成果展示',
  },
  {
    name: '第四次工业革命主要成果展示',
  },
  {
    name: '第四次工业革命主要成果展示',
  },
];

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '上传本地文档',
    children: <LocalFile files={files} />,
  },
  {
    key: '2',
    label: '文库文档',
    children: <CloudFile files={files} />,
  },
];

const onChange = (key: string) => {
  console.log(key);
};

const FileModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
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
          onChange={onChange}
          tabBarExtraContent={{
            right: (
              <div>
                <Button type="primary" className="mr-[18px]">
                  确认
                </Button>
                <CloseOutlined onClick={handleCancel} />
              </div>
            ),
          }}
        />
      </Modal>
    </>
  );
};

export default FileModal;
