import FileChat from '@/assets/images/file-chat.png';
import GuideChat from '@/assets/images/guide-chat.png';
import LeftSvg from '@/assets/images/left.svg';
import RightSvg from '@/assets/images/right.svg';
import SendSvg from '@/assets/images/send.svg';
import TranslatePNG from '@/assets/images/translate.png';
import UploadSvg from '@/assets/images/upload.svg';
import { Sender } from '@ant-design/x';
import { Button, Layout, Row, Space, Typography } from 'antd';
import React from 'react';
import RobotAvatar from '../RobotAvator';
import styles from './Guide.less';

interface Props {
  name: string;
}

const WelcomeCardList = [
  {
    key: '1',
    image: GuideChat,
    title: '智能对话',
    description: '实时解答，提高沟通效率',
  },
  {
    key: '2',
    image: FileChat,
    title: '文档问答',
    description: '提升信息检索能力、实现知识共享',
  },
  {
    key: '3',
    image: TranslatePNG,
    title: '智能翻译',
    description: '多种语言的互译，准确高效',
  },
];

// 脚手架示例组件
const Guide: React.FC<Props> = () => {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setValue('');
        alert('Send message successfully!');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    <Layout className="flex flex-col">
      <Row className="mt-[100px] mb-[100px]">
        <Typography.Title level={1} className={styles.title}>
          <img
            src={LeftSvg}
            className="w-[70px] h-[30px] mr-[30px] inline-block"
          />
          专业文档搜索、阅读、问答更高效
          <img
            src={RightSvg}
            className="w-[70px] h-[30px] ml-[30px] inline-block"
          />
        </Typography.Title>
      </Row>
      <Row className="flex justify-between flex-1">
        {WelcomeCardList.map((item) => (
          <div
            key={item.key}
            className={`${styles.card} w-1/4 flex flex-col items-center justify-center mb-[150px]`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[190px] h-[190px] mt-[14px] "
            />
            <Typography.Title level={4} className={styles.cardTitle}>
              {item.title}
            </Typography.Title>
            <Typography.Paragraph className={styles.cardDescription}>
              {item.description}
            </Typography.Paragraph>
          </div>
        ))}
      </Row>
      <Row className="flex justify-center ">
        <div className="relative w-full mb-6">
          <RobotAvatar className="w-[100px] h-[85px] absolute left-0 -top-[14px]" />
          <div className={`${styles.message} w-full h-[62px] ml-[70px]`}>
            <span className="text-[#000614] text-lg text-left leading-[62px] block ml-[42px]">
              你好，作为你智能的伙伴，我可以帮助你快速处理文档、答疑解惑。
            </span>
          </div>
        </div>
        <Sender
          className="h-[140px]"
          submitType="shiftEnter"
          value={value}
          loading={loading}
          onChange={setValue}
          onSubmit={() => {
            setLoading(true);
          }}
          onCancel={() => {
            setLoading(false);
          }}
          actions={() => {
            // const { SendButton, LoadingButton, ClearButton } = info.components;

            return (
              <Space size="small">
                <Button icon={<img src={UploadSvg} alt="upload" />} />
                <Button type="primary" icon={<img src={SendSvg} alt="send" />}>
                  发送
                </Button>
              </Space>
            );
          }}
        />
      </Row>
    </Layout>
  );
};

export default Guide;
