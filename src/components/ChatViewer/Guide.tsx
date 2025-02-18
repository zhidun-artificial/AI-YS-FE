import FileChat from '@/assets/images/file-chat.png';
import BgMessage from '@/assets/images/guide-bg.svg';
import BgCard from '@/assets/images/guide-card-bg.svg';
import GuideChat from '@/assets/images/guide-chat.png';
import LeftSvg from '@/assets/images/left.svg';
import RightSvg from '@/assets/images/right.svg';
import RobotAvatar from '@/components/RobotAvatar';
import { Layout, Row, Typography } from 'antd';
import React from 'react';

// interface GuideProps {

// }

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
    image: GuideChat,
    title: '智能翻译',
    description: '外语文献的翻译，准确高效',
  },
];

interface GuideCardProps {
  onSelect?: (key: string) => void;
}

// 脚手架示例组件
const Guide: React.FC<GuideCardProps> = ({ onSelect }) => {
  return (
    <Layout className="flex flex-col bg-transparent">
      <Row className="mt-[100px] mb-[100px]">
        <Typography.Title level={1} className="m-auto">
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
            style={{
              backgroundImage: `url(${BgCard})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat',
            }}
            className={`w-1/4 flex flex-col items-center justify-center mb-[150px] cursor-pointer`}
            onClick={() => onSelect && onSelect(item.key)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[190px] h-[190px] mt-[14px] "
            />
            <Typography.Title level={4}>{item.title}</Typography.Title>
            <Typography.Paragraph>{item.description}</Typography.Paragraph>
          </div>
        ))}
      </Row>
      <Row className="flex justify-center ">
        <div className="relative w-full mb-6">
          <RobotAvatar className="w-[100px] h-[85px] absolute left-0 -top-[14px]" />
          <div
            style={{
              backgroundImage: `url(${BgMessage})`,
              backgroundSize: '100%',
            }}
            className={`w-full h-[62px] ml-[70px]`}
          >
            <span className="text-[#000614] text-lg text-left leading-[62px] block ml-[42px]">
              你好，作为你智能的伙伴，我可以帮助你快速处理文档、答疑解惑。
            </span>
          </div>
        </div>
      </Row>
    </Layout>
  );
};

export default Guide;
