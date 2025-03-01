import {
  ConversationInfo,
  getConversations,
} from '@/services/chat/getConversations';
import { removeConversation } from '@/services/chat/removeConversation';
import { renameConversation } from '@/services/chat/renameConversation';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Conversations, ConversationsProps } from '@ant-design/x';
import { Conversation } from '@ant-design/x/es/conversations';
import { Modal, type GetProp } from 'antd';
import React, { useEffect, useState } from 'react';
import RenameDialog from './RenameDialog';

interface ConversationHistoryProps {
  searchTime: number;
  onSelectConversation?: (conversation: ConversationInfo) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  searchTime,
  onSelectConversation,
}) => {
  const [conversationsItems, setConversationsItems] = useState<
    ConversationInfo[]
  >([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameDialogConversation, setRenameDialogConversation] =
    useState<Conversation>();

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (
    key,
  ) => {
    const conversation = conversationsItems.find((item) => item.id === key);
    if (!conversation) {
      return;
    }
    setActiveConversationId(key);
    if (onSelectConversation) onSelectConversation(conversation);
  };

  useEffect(() => {
    const updateConversations = async () => {
      const res = await getConversations();
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        setConversationsItems(res.data.records);
      }
    };
    updateConversations();
  }, [searchTime]);

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: '重命名',
        key: 'rename',
        icon: <EditOutlined />,
      },
      {
        label: '删除',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      menuInfo.domEvent.stopPropagation();
      if (menuInfo.key === 'rename') {
        setRenameDialogConversation(conversation);
        setRenameDialogOpen(true);
      } else if (menuInfo.key === 'delete') {
        Modal.confirm({
          type: 'warning',
          content: (
            <span>
              确定删除会话 <b>{conversation.label}</b> 吗？
            </span>
          ),
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const res = await removeConversation({ id: conversation.key });
            if (res instanceof Error) {
              return;
            }
            if (res.code === 0) {
              setConversationsItems((prev) =>
                prev.filter((item) => item.id !== conversation.key),
              );
            }
          },
          destroyOnClose: true,
        });
      }
    },
  });

  const onRenameConfirm = async (id: string, name: string) => {
    if (!id || !name) return;
    const res = await renameConversation({ id, newName: name });
    if (res instanceof Error) {
      setRenameDialogOpen(false);
      return;
    }
    if (res.code === 0) {
      setConversationsItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, name };
          }
          return item;
        }),
      );
    }
    setRenameDialogOpen(false);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* 🌟 会话管理 */}
      <Conversations
        items={conversationsItems.map((item) => ({
          key: item.id,
          label: item.name,
          timestamp: item.createTime,
          ...item,
        }))}
        menu={menuConfig}
        activeKey={activeConversationId}
        onActiveChange={onConversationClick}
      />
      <RenameDialog
        open={renameDialogOpen}
        conversation={renameDialogConversation}
        onOpenChange={(open) => setRenameDialogOpen(open)}
        onConfirm={onRenameConfirm}
      />
    </div>
  );
};

export default ConversationHistory;
