// 全局共享数据示例
import { APP_NAME } from '@/constants';
import { useState } from 'react';

interface GlobalInfo {
  appName: string;
  version: string;
}

const useGlobal = () => {
  const [globalInfo, setGlobalInfo] = useState<GlobalInfo>({
    appName: APP_NAME,
    version: '1.0.0',
  });
  return {
    globalInfo: globalInfo,
    setGlobalInfo: setGlobalInfo,
  };
};

export default useGlobal;
