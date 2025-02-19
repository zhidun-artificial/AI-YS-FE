import ReadViewer from '@/components/ReadViewer';
import { useMatch, useModel } from '@umijs/max';
import React from 'react';

const ChatPage: React.FC = () => {
  const match = useMatch('chat/:id');
  const { user } = useModel('user');

  return (
    <ReadViewer
      key={match?.params.id}
      userId={user.id}
      conversationId={match?.params.id}
    ></ReadViewer>
  );
};

export default ChatPage;
