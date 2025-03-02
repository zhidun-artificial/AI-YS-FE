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
import { chatWithAgent, DocFileInfo } from '@/services/chat/chatConversation';
import { chatWithAssistant } from '@/services/chat/chatWithAssistant';
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
import MarkdownContent from './MarkdownContent';

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
  chatMode: 'chat' | 'chatWithAssistant';
  assistantId: this['chatMode'] extends 'chatWithAssistant' ? string : undefined;
  withDocFiles?: DocFileInfo[];
  onSelectPdfReader?: (files: DocFileInfo[]) => void;
}

export interface ChatViewerRef {
  sendMessage: (message: string) => void;
}


const ChatViewer: React.ForwardRefRenderFunction<
  ChatViewerRef,
  ChatViewerProps
> = ({ user, chatMode = 'chat', conversationId, assistantId, withDocFiles = [] }, ref) => {
  // ==================== State ====================
  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    user: user,
    conversationId: conversationId,
  });
  const [chatAssistantId] = useState<string | undefined>(assistantId);
  const [model, setModel] = useState<string>('');
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const tempFiles = useRef<MessageFileInfo[]>([]);
  // const docFiles = useRef<MessageFileInfo[]>(withDocFiles);
  const slashWithFiles = useRef<boolean>(withDocFiles.length > 0);
  const [newQueryCount, setNewQueryCount] = useState(0);
  const [content, setContent] = useState('');
  const [hasAttachment, setHasAttachment] = useState(withDocFiles.length > 0);
  const attachmentRef = useRef<ChatAttachmentsRef>(null);
  const { theme } = useContext(ConfigContext);

  //  =================== Roles ====================

  // 渲染回答
  const renderMarkdown: BubbleProps['messageRender'] = (content) => (
    <Flex vertical className='min-w-24 group'>
      <MarkdownContent content={content} />
    </Flex>
  );

  // 渲染完整的回答
  const renderFullAnswer: BubbleProps['messageRender'] = (content) => {
    const { answer, ctx = {} } = JSON.parse(content) as FullAnswerMessage;
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
        <Flex className='h-14 justify-end items-end flex-row gap-3' style={{ height: 24, flex: 0 }}>
          <span className='cursor-pointer' title='复制'><CopyFilled style={{ color: '#6B7280', fontSize: 16 }} /></span>
          <span className='cursor-pointer' title='删除'><DeleteFilled style={{ color: '#6B7280', fontSize: 16 }} /></span>
        </Flex>
      </Flex>
    )
  }

  // 渲染文件
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

  // 渲染查询
  const renderQuery: BubbleProps['messageRender'] = (content) => (
    <Flex vertical className='min-w-24 group'>
      <Typography.Paragraph style={{ color: 'white', flex: 1 }}>{content}</Typography.Paragraph>
      <Flex className='h-14 justify-end items-end flex-row gap-3 invisible group-hover:visible' style={{ height: 28, flex: 0, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <span className='cursor-pointer' title='复制'><CopyFilled style={{ fontSize: 16 }} /></span>
        <span className='cursor-pointer' title='删除'><DeleteFilled style={{ fontSize: 16 }} /></span>
      </Flex>
    </Flex>
  )

  // 交互类型配置
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
      avatar: <Avatar size={32} style={{ background: theme?.token?.colorPrimary }} icon={<RobotSvg width={18} height={18} />}></Avatar>,
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
      avatar: <Avatar size={32} style={{ background: theme?.token?.colorPrimary }} icon={<RobotSvg width={18} height={18} />}></Avatar>,
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

      const ret = chatMode === 'chat' ?
        await chatWithAgent({
          conversationId: message.conversationId,
          query: message.content,
          llmModel: message?.meta?.llm as string || '',
          baseIds: message?.meta?.baseIds as string[] || [],
          files: message?.ctx?.files || []
        }) :
        await chatWithAssistant({
          conversationId: message.conversationId,
          query: message.content,
          assistantId: chatAssistantId || '',
          files: message?.ctx?.files || []
        })

      if (ret instanceof Error) {
        onError(ret);
      } else {
        let tmpChatInfo: ChatInfo | null = null;
        const contents: string[] = [];
        let ctxInfo: MessageData['ctx'] = undefined;
        for await (const chunk of XStream({ readableStream: ret })) {
          const parsedMessage = convertMessage(chunk.data);
          if (parsedMessage !== false) {
            if (parsedMessage.event === 'rag') {
              // 上下文消息
              ctxInfo = parsedMessage.ctx;
            } else if (parsedMessage.event === 'partial_message') {
              // 实时更新消息
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
        }
        if (tmpChatInfo) setChatInfo(() => tmpChatInfo);
        onSuccess({
          type: 'fullAnswer',
          id: tmpChatInfo?.conversationId || '',
          conversationId: tmpChatInfo?.conversationId || '',
          content: JSON.stringify({
            messageId: tmpChatInfo?.conversationId || '',
            answer: contents.join(''),
            ctx: ctxInfo
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
      const res = await getHistoryMessages({ conversationId });
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        setChatInfo({ conversationId: conversationId, user: user });
        const historyMessages: Parameters<typeof setMessages>[0] = [];
        res.data.records.forEach((item, i) => {
          const { files = [], resources = [] } = item.files;
          if (files && files.length > 0) {
            historyMessages.push({
              status: 'local',
              message: {
                type: 'files',
                content: JSON.stringify(
                  item.files.files.map((f, j) => ({
                    id: `${f.id || `msg-${i}-f${j}-${f.fileName}`}`,
                    fileName: f.fileName,
                    url: f.url
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
                  resource: resources || [],
                  files: files || [],
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
    setHasAttachment(tempFiles.current.length > 0);
  };

  // ==================== Event ====================

  // 发送消息
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    if (agent.isRequesting()) return;
    if (tempFiles.current.length > 0) {
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
                // ...docFiles.current,
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
      ctx: {
        files: tempFiles.current,
      },
      meta: {
        llm: model,
        baseIds: knowledgeBases
      }
      // docFiles: docFiles.current,
    });
    tempFiles.current = [];
    // docFiles.current = [];
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
        {chatMode === 'chat' &&
          <div className='flex flex-row gap-4 items-center'>
            <div><span>模型：</span> <ModelSelect style={{ width: 200 }} onUpdate={(v) => { setModel(v) }}></ModelSelect></div>
            <div><span>知识库：</span> <KnowledgeSelect style={{ width: 200 }} onUpdate={(v) => { setKnowledgeBases(v) }} ></KnowledgeSelect></div>
          </div>}
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
                icon={<SendSvg style={{ width: 14, height: 14, color: '#FFF', marginRight: 8 }} />}
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
