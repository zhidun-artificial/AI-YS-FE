// 全局共享数据示例
import { APP_NAME } from '@/constants';
import dayjs from 'dayjs';
import { useState } from 'react';

interface GlobalInfo {
  appName: string;
  version: string;
  buildTime: string;
}

const useGlobal = () => {
  const [globalInfo] = useState<GlobalInfo>({
    appName: APP_NAME,
    version: '1.0.0',
    buildTime: dayjs(process.env.BUILD_TIME).format('YYYY-MM-DD'),
  });
  return {
    globalInfo: globalInfo,
  };
};

export default useGlobal;
