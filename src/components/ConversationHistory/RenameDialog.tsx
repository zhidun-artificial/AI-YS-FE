import { Conversation } from '@ant-design/x/es/conversations';
import { Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

interface RenameDialogProps {
  conversation?: Conversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, name: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  open,
  conversation,
  onOpenChange,
  onConfirm,
}) => {
  const [nameValue, setNameValue] = useState(conversation?.name);

  useEffect(() => {
    setNameValue(conversation?.name);
  }, [conversation]);

  return (
    <Modal
      title="重命名"
      open={open}
      okText="确认"
      cancelText="取消"
      onCancel={() => onOpenChange(false)}
      onClose={() => onOpenChange(false)}
      onOk={() => onConfirm(conversation?.id || '', nameValue || '')}
      closable={false}
    >
      <Input
        type="text"
        value={nameValue}
        onChange={(e) => {
          setNameValue(e.target.value);
        }}
      />
    </Modal>
  );
};

export default RenameDialog;
