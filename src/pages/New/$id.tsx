import ReadViewer from '@/components/ReadViewer';
import { DocFileInfo } from '@/services/chat/chatConversation';
import { useLocation, useMatch, useModel } from '@umijs/max';
import React from 'react';

const NewPage: React.FC = () => {
  const match = useMatch('new/:id');
  const { state } = useLocation();
  const { user } = useModel('user');
  const withFiles = state
    ? (state as { tmpFiles: DocFileInfo[]; docFiles: DocFileInfo[] })
    : { tmpFiles: [], docFiles: [] };
  const assistantId = state ? (state as { assistantId: string }).assistantId : '';

  return (
    <ReadViewer
      key={match?.params.id}
      userId={user.id}
      docFiles={withFiles.docFiles}
      assistantId={assistantId}
    ></ReadViewer>
  );
};

export default NewPage;
