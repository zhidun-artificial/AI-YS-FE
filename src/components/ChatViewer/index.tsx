import { chatWithAgent, DocFileInfo } from '@/services/chat/chatConversation';
import {
  Bubble,
  Sender,
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
import AttachmentCard from '../ChatAttachments/AttachmentCard';
import useXChat from '../antdx/use-x-chat';
import useXAgent from '../antdx/use-x-agent';
import ReactMarkdown from 'react-markdown';

interface ChatInfo {
  user: number;
  conversationId: string;
}

type MessageFileInfo = DocFileInfo;

interface FullAnswerMessage {
  messageId: string,
  answer: string,
  ctx: {
    resource?: Array<{ documentId: string; fileName: string; url: string }>
    files?: Array<{ id: string; fileName: string; url: string }>
  }
}

interface ChatViewerProps {
  user: number;
  conversationId: string;
  withDocFiles?: DocFileInfo[];
  onSelectPdfReader?: (files: DocFileInfo[]) => void;
}

export interface ChatViewerRef {
  sendMessage: (message: string) => void;
}

const MarkdownContent = React.memo(({ content }: { content: string }) => {
  return (
    <Typography>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Typography>
  );
});

const ChatViewer: React.ForwardRefRenderFunction<
  ChatViewerRef,
  ChatViewerProps
> = ({ user, conversationId, withDocFiles = [] }, ref) => {
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
    <Flex vertical className='min-w-24 group'>
      <MarkdownContent content={content} />
    </Flex>
  );

  const renderFullAnswer: BubbleProps['messageRender'] = (content) => {
    const { answer, ctx } = JSON.parse(content) as FullAnswerMessage;
    return (
      <Flex vertical className='min-w-24'>
        <MarkdownContent content={answer} />
        {ctx.resource && ctx.resource.length > 0 && <Flex vertical gap={4} className='my-3'>
          <span className='italic text-[#4B5563]'>参考知识库：</span>
          {
            ctx.resource?.map((file) => {
              return (
                <AttachmentCard
                  styles={{ container: { backgroundColor: '#FFF' } }}
                  key={file.documentId}
                  info={{
                    id: file.documentId,
                    fileName: file.fileName,
                    url: file.url,
                  }}
                  actions={{
                    onView: (info) => { console.log(info) },
                    onDownload: (info) => { console.log(info) }
                  }}
                ></AttachmentCard>
              );
            })
          }
        </Flex>}
        <Flex className='h-14 justify-end items-end gap-3' style={{ height: 56, flex: 0 }}>
          <span className='cursor-pointer' title='复制'><CopyFilled style={{ color: '#6B7280', fontSize: 16 }} /></span>
          <span className='cursor-pointer' title='删除'><DeleteFilled style={{ color: '#6B7280', fontSize: 16 }} /></span>
        </Flex>
      </Flex>
    )
  }

  const renderFiles: BubbleProps['messageRender'] = (content) => {
    const files = JSON.parse(content) as Array<MessageFileInfo>;
    return (
      <div className="flex flex-col gap-2 bg-white p-2 rounded-lg">
        <span className='italic'>引用文档：</span>
        <div className="flex flex-row gap-1 flex-wrap">
          {files.map((file) => {
            return (
              <AttachmentCard
                key={file.id || file.fileName}
                info={{
                  id: file.id,
                  fileName: file.fileName,
                  url: file.url,
                }}
                actions={{
                  onView: (info) => { console.log(info) }
                }}
              ></AttachmentCard>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuery: BubbleProps['messageRender'] = (content) => (
    <Flex vertical className='min-w-24 group'>
      <Typography.Paragraph style={{ color: 'white', flex: 1 }}>{content}</Typography.Paragraph>
      <Flex className='h-14 justify-end items-end gap-3 invisible group-hover:visible' style={{ height: 28, flex: 0, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <span className='cursor-pointer' title='复制'><CopyFilled style={{ fontSize: 16 }} /></span>
        <span className='cursor-pointer' title='删除'><DeleteFilled style={{ fontSize: 16 }} /></span>
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
        avatar: {
          marginRight: 4
        },
        content: {
          borderRadius: 8,
          background: '#F3F4F6',
          marginBottom: 8
        },
      },
      messageRender: renderMarkdown,
    },
    fullAnswer: {
      avatar: <Avatar size={32} style={{ background: theme?.token?.colorPrimary }} icon={<RobotSvg width={18} height={18} />}></Avatar>,
      placement: 'start',
      typing: false,
      classNames: {},
      styles: {
        avatar: {
          marginRight: 4
        },
        content: {
          borderRadius: 8,
          background: '#F3F4F6',
          marginBottom: 12
        },
      },
      messageRender: renderFullAnswer,
    },
    query: {
      avatar: <Avatar size={32} src={botImg}></Avatar>,
      placement: 'end',
      variant: 'shadow',
      classNames: {},
      styles: {
        avatar: {
          marginLeft: 4
        },
        content: {
          color: 'white',
          background: theme?.token?.colorPrimary,
          borderRadius: 8,
          paddingBottom: 4,
          marginBottom: 12
        },
      },
      messageRender: renderQuery
    },
    files: {
      avatar: <Avatar size={32} src={botImg}></Avatar>,
      placement: 'end',
      variant: 'borderless',
      messageRender: renderFiles,
      styles: {
        avatar: {
          marginLeft: 4
        },
        content: {
          marginBottom: 12
        }
      }
    },
  };

  // ==================== Runtime ====================
  const [agent] = useXAgent<MessageData>({
    request: async ({ message }, { onRequest, onUpdate, onSuccess, onError }) => {
      if (!message) {
        onError(new Error('Please input message'));
        return;
      }
      onRequest({
        type: 'answer',
        id: 'loading',
        content: '',
        conversationId: '',
      });
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
            parsedMessage.content = contents.join('');
            onUpdate(parsedMessage);
          }
        }
        if (tmpChatInfo) setChatInfo(() => tmpChatInfo);
        onSuccess({
          type: 'fullAnswer',
          id: tmpChatInfo?.conversationId || '',
          conversationId: tmpChatInfo?.conversationId || '',
          content: JSON.stringify({
            messageId: tmpChatInfo?.conversationId || '',
            answer: contents.join(''),
            ctx: {
              resource: [
                {
                  documentId: 'doc-1',
                  fileName: '文档1.pdf',
                  url: 'https://www.baidu.com',
                },
                {
                  documentId: 'doc-2',
                  fileName: '文档2.pdf',
                  url: 'https://www.baidu.com',
                },
              ],
              files: [],
            },
          }),
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
              type: 'fullAnswer',
              content: JSON.stringify({
                messageId: item.id,
                answer: item.answer,
                ctx: {
                  resource: [
                    {
                      documentId: 'doc-1',
                      fileName: '文档1.pdf',
                      url: 'https://www.baidu.com',
                    },
                    {
                      documentId: 'doc-2',
                      fileName: '文档2.pdf',
                      url: 'https://www.baidu.com',
                    },
                  ],
                },
              }),
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
      typing: false,
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
          <Bubble.List items={items} roles={roles} style={{ display: 'block' }} className="flex-1 px-4" />
        )}
        {/* 🌟 提示词 */}
        {/* <PromptsPreset onSelectPrompt={onPromptsItemClick}></PromptsPreset> */}
        {/* 参数选择 */}
        <div className='flex flex-row gap-4'>
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
