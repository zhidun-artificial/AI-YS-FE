import PosterImg from '@/assets/images/home/poster.png';
import { Typography } from 'antd';
import React from 'react';


// 脚手架示例组件
const Guide: React.FC = () => {

  return (
    <div className='w-full h-full flex flex-col justify-center items-center bg-white'>
      <img src={PosterImg} alt='poster' />
      <Typography.Title style={{ fontSize: 24 }} className='mt-6 mb-3'>你好，张幸福！想聊点什么呢？</Typography.Title>
      <Typography.Text style={{ fontSize: 16 }}>你的超级智能助手已上线，工作学习全涵盖，可靠智能，时刻在线陪伴。</Typography.Text>
    </div>
  );
};

export default Guide;
