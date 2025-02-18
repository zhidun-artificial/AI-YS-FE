import ChatViewer, { ChatViewerRef } from '@/components/ChatViewer';
// import PDFViewer, { PDFViewerProps } from '@/components/PdfViewer';
import { DocFileInfo } from '@/services/chat/chatConversation';
import React, { useState } from 'react';

export interface ReadViewerProps {
  userId: number;
  conversationId?: string;
  temFiles?: DocFileInfo[];
  docFiles?: DocFileInfo[];
}

const ReadViewer: React.FC<ReadViewerProps> = ({
  userId,
  conversationId,
  docFiles = [],
}) => {
  const [referenceFiles, setReferenceFiles] = useState<DocFileInfo[]>([]);
  const [mode, setMode] = useState<'translate' | 'original'>('original');
  const chatViewerRef = React.useRef<ChatViewerRef>(null);

  // const onPdfAction: PDFViewerProps['onAction'] = (action, content) => {
  //   if (!chatViewerRef.current) return;
  //   if (action === 'interpret') {
  //     chatViewerRef.current.sendMessage(`解释以下内容: ${content}`);
  //   } else if (action === 'translate') {
  //     chatViewerRef.current.sendMessage(`翻译以下内容: ${content}`);
  //   }
  // };

  return (
    <div className="w-full h-full overflow-hidden flex gap-2">
      <div
        className="flex-1 h-full"
        style={{ flexBasis: mode === 'translate' ? '33.33%' : '40%' }}
      >
        <ChatViewer
          ref={chatViewerRef}
          user={userId}
          conversationId={conversationId || ''}
          withDocFiles={docFiles}
          onSelectPdfReader={(files) => {
            setReferenceFiles(files);
            setMode('original');
          }}
        ></ChatViewer>
      </div>
      {/* {referenceFiles.length > 0 && (
        <div
          className="flex-1 h-full overflow-hidden"
          style={{ flexBasis: mode === 'translate' ? '66.66%' : '60%' }}
        >
          <PDFViewer
            files={referenceFiles}
            onExit={() => setReferenceFiles([])}
            onAction={onPdfAction}
            onModeChange={(mode) => setMode(mode)}
          ></PDFViewer>
        </div>
      )} */}
    </div>
  );
};

export default ReadViewer;
