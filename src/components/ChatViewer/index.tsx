import { chatWithAgent, DocFileInfo } from '@/services/chat/chatConversation';
import {
  Attachments,
  Bubble,
  Sender,
  useXAgent,
  useXChat,
  XStream,
  type BubbleProps,
} from '@ant-design/x';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Avatar, Badge, Button, Flex, Typography, type GetProp } from 'antd';
import markdownIt from 'markdown-it';
import { convertMessage, MessageData } from './adapter';

import botImg from '@/assets/images/bot.svg';
import { getHistoryMessages } from '@/services/chat/getHistoryMessages';
import ChatAttachments, {
  ChatAttachmentsProps,
  ChatAttachmentsRef,
} from '../ChatAttachments';
import Guide from './Guide';
import ModelSelect from './ModelSelect';
import KnowledgeSelect from './KnowledgeSelect';
import { ConfigContext } from 'antd/es/config-provider';
import { CopyFilled, DeleteFilled } from '@ant-design/icons';
import { ReactComponent as SendSvg } from '@/icons/send.svg';
import { ReactComponent as RobotSvg } from '@/icons/robot.svg';

const md = markdownIt({ html: true, breaks: true });

interface ChatInfo {
  user: number;
  conversationId: string;
}

type MessageFileInfo = DocFileInfo;

interface ChatViewerProps {
  user: number;
  conversationId: string;
  withDocFiles?: DocFileInfo[];
  onSelectPdfReader?: (files: DocFileInfo[]) => void;
}

export interface ChatViewerRef {
  sendMessage: (message: string) => void;
}

const ChatViewer: React.ForwardRefRenderFunction<
  ChatViewerRef,
  ChatViewerProps
> = ({ user, conversationId, withDocFiles = [], onSelectPdfReader }, ref) => {
  // ==================== State ====================
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    user: user,
    conversationId: conversationId,
  });
  const tempFiles = useRef<MessageFileInfo[]>([]);
  const docFiles = useRef<MessageFileInfo[]>(withDocFiles);
  const slashWithFiles = useRef<boolean>(withDocFiles.length > 0);
  const [newQueryCount, setNewQueryCount] = useState(0);
  const [content, setContent] = useState('');
  const [hasAttachment, setHasAttachment] = useState(withDocFiles.length > 0);
  const attachmentRef = useRef<ChatAttachmentsRef>(null);
  const { theme } = useContext(ConfigContext);

  //  =================== Roles ====================

  const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );

  const renderFiles: BubbleProps['messageRender'] = (content) => {
    const files = JSON.parse(content) as Array<MessageFileInfo>;
    return (
      <div className="flex flex-col gap-2 bg-white p-2 rounded-lg">
        <div className="flex flex-row gap-1 flex-wrap">
          {files.map((file) => {
            return (
              <Attachments.FileCard
                key={file.id || file.fileName}
                item={{
                  uid: file.id,
                  name: file.fileName,
                  url: file.url,
                }}
              ></Attachments.FileCard>
            );
          })}
        </div>
        <Button
          size="small"
          type="link"
          onClick={() => {
            if (onSelectPdfReader) onSelectPdfReader(files);
          }}
        >
          进入AI阅读
        </Button>
      </div>
    );
  };

  const renderQuery: BubbleProps['messageRender'] = (content) => (
    <Flex vertical className='min-w-24 group'>
      <Typography.Paragraph style={{ color: 'white', flex: 1 }}>{content}</Typography.Paragraph>
      <Flex className='h-14 justify-end items-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ height: 56, flex: 0, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <span className='cursor-pointer' title='复制'><CopyFilled /></span>
        <span className='cursor-pointer' title='删除'><DeleteFilled /></span>
      </Flex>
    </Flex>
  )

  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    answer: {
      avatar: <Avatar size={32} style={{ background: theme?.token?.colorPrimary }} icon={<RobotSvg width={18} height={18} />}></Avatar>,
      placement: 'start',
      typing: false,
      classNames: {},
      styles: {
        content: {
          borderRadius: 8,
          background: '#F3F4F6',
        },
      },
      messageRender: renderMarkdown,
    },
    query: {
      avatar: <Avatar size={32} src={botImg}></Avatar>,
      placement: 'end',
      variant: 'shadow',
      classNames: {},
      styles: {
        content: {
          color: 'white',
          background: theme?.token?.colorPrimary,
          borderRadius: 8,
          paddingBottom: 4
        },
      },
      messageRender: renderQuery
    },
    files: {
      avatar: <Avatar size={32} src={botImg}></Avatar>,
      placement: 'end',
      variant: 'borderless',
      messageRender: renderFiles,
    },
  };

  // ==================== Runtime ====================
  const [agent] = useXAgent<MessageData>({
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      if (!message) {
        onError(new Error('Please input message'));
        return;
      }
      const ret = await chatWithAgent({
        conversationId: message.conversationId,
        query: message.content,
        tmpFiles: message.tempFiles || [],
        documents: message.docFiles || [],
      });

      if (ret instanceof Error) {
        onError(ret);
      } else {
        let tmpChatInfo: ChatInfo | null = null;
        const contents: string[] = [];
        for await (const chunk of XStream({ readableStream: ret })) {
          const parsedMessage = convertMessage(chunk.data);
          if (parsedMessage !== false) {
            contents.push(parsedMessage.content);
            if (!tmpChatInfo)
              tmpChatInfo = {
                user: chatInfo.user,
                conversationId: parsedMessage.conversationId,
              };
            onUpdate(parsedMessage);
          }
        }
        if (tmpChatInfo) setChatInfo(() => tmpChatInfo);
        onSuccess({
          type: 'answer',
          id: tmpChatInfo?.conversationId || '',
          conversationId: tmpChatInfo?.conversationId || '',
          content: contents.join(''),
        });
      }
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  // 对于带有文档的会话创建，优先初始消息
  useEffect(() => {
    if (withDocFiles.length > 0) {
      const historyMessages: Parameters<typeof setMessages>[0] = [];
      historyMessages.push({
        status: 'local',
        message: {
          type: 'files',
          content: JSON.stringify(withDocFiles),
          conversationId: chatInfo.conversationId,
          id: `files-with-route`,
        },
        id: `files-with-route`,
      });
      setMessages([...messages, ...historyMessages]);
    }
  }, []);

  // 历史会话创建会话消息队列
  useEffect(() => {
    const updateMessages = async () => {
      const res = await getHistoryMessages({ id: conversationId });
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        setChatInfo({ conversationId: conversationId, user: user });
        const historyMessages: Parameters<typeof setMessages>[0] = [];
        res.data.data.forEach((item, i) => {
          if (item.inputs.files.length > 0) {
            historyMessages.push({
              status: 'local',
              message: {
                type: 'files',
                content: JSON.stringify(
                  item.inputs.files.map((f, j) => ({
                    id: `${f.id || `msg-${i}-f${j}-${f.filename}`}`,
                    fileName: f.filename,
                    url: f.remote_url,
                    size: f.size,
                  })),
                ),
                conversationId: chatInfo.conversationId,
                id: `files-${item.id}`,
              },
              id: `files-${item.id}`,
            });
          }
          historyMessages.push({
            status: 'local',
            message: {
              type: 'query',
              content: item.query,
              conversationId: conversationId,
              id: `query-${item.id}`,
            },
            id: `query-${item.id}`,
          });
          historyMessages.push({
            status: 'local',
            message: {
              type: 'answer',
              content: item.answer,
              conversationId: chatInfo.conversationId,
              id: `answer-${item.id}`,
            },
            id: `answer-${item.id}`,
          });
        });
        setMessages([...messages, ...historyMessages]);
      }
    };
    if (conversationId) updateMessages();
  }, [conversationId]);

  const onAttachmentChange: ChatAttachmentsProps['onConfirm'] = (
    selectFiles,
  ) => {
    tempFiles.current = [...selectFiles.tmpFiles];
    docFiles.current = [...selectFiles.docFiles];
    setHasAttachment(tempFiles.current.length + docFiles.current.length > 0);
  };

  // ==================== Event ====================

  // 发送消息
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    if (agent.isRequesting()) return;
    if (tempFiles.current.length > 0 || docFiles.current.length > 0) {
      // 如果有携带文件，则不需要再次发送消息
      if (!slashWithFiles.current) {
        setMessages([
          ...messages,
          {
            id: `files-${newQueryCount}`,
            message: {
              type: 'files',
              content: JSON.stringify([
                ...tempFiles.current,
                ...docFiles.current,
              ]),
              conversationId: chatInfo.conversationId,
              id: `files-${newQueryCount}`,
            },
            status: 'local',
          },
        ]);
      }
    }
    onRequest({
      id: `newQuery-${newQueryCount}`,
      content: nextContent,
      conversationId: chatInfo.conversationId,
      type: 'query',
      tempFiles: tempFiles.current,
      docFiles: docFiles.current,
    });
    tempFiles.current = [];
    docFiles.current = [];
    slashWithFiles.current = false;
    setContent('');
    setNewQueryCount(newQueryCount + 1);
  };

  // const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
  //   const prompt = (info.data as unknown as { prompt: string }).prompt;
  //   onSubmit(prompt);
  // };

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: message.type,
      content: message.content,
      typing: status !== 'local',
    }),
  );

  const attachmentsNode = (
    <Badge dot={hasAttachment}>
      <ChatAttachments
        ref={attachmentRef}
        onConfirm={onAttachmentChange}
      ></ChatAttachments>
    </Badge>
  );

  // 选择引导功能
  // const onSelectFunc = (key: string) => {
  //   if (key === '2') {
  //     attachmentRef.current?.open();
  //   } else if (key === '3') {
  //     attachmentRef.current?.open({
  //       maxCount: 1,
  //       tip: '翻译仅支持选择一个文件',
  //     });
  //   }
  // };

  // =================== expose methods ====================
  useImperativeHandle(ref, () => ({
    sendMessage: (message) => {
      onSubmit(message);
    },
  }));

  // ==================== Render =================

  return (
    <div className={`w-full  h-full bg-white`}>
      <div className="h-full w-full max-w-[1200px] m-auto flex flex-col gap-4 py-4">
        {!chatInfo.conversationId && items.length === 0 ? (
          <Guide />
        ) : (
          // 🌟 消息列表
          <Bubble.List items={items} roles={roles} className="flex-1" />
        )}
        {/* 🌟 提示词 */}
        {/* <PromptsPreset onSelectPrompt={onPromptsItemClick}></PromptsPreset> */}
        {/* 参数选择 */}
        <div className='flex gap-4'>
          <ModelSelect style={{ width: 200 }}></ModelSelect>
          <KnowledgeSelect style={{ width: 200 }}></KnowledgeSelect>
        </div>
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          onSubmit={onSubmit}
          onChange={setContent}
          placeholder='请输入您的问题，让我来协助您...'
          // 开始对话之后，则无法进行附件上传
          prefix={messages.length > 0 ? null : attachmentsNode}
          loading={agent.isRequesting()}
          className="bg-[#F9FAFB] rounded"
          actions={() => {
            return (
              <Button type="primary"
                icon={<SendSvg style={{ width: 14, height: 14, color: '#FFF' }} />}
                disabled={agent.isRequesting()}
                loading={agent.isRequesting()}
                onClick={() => onSubmit(content)}>发送</Button>
            )
          }}
        />
      </div>
    </div>
  );
};

export default forwardRef(ChatViewer);
