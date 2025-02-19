import '@umijs/max/typings';

// 声明 process.env 类型
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      BASE_URL: string;
      API_ID: string;
      BUILD_TIME: number;
    }
  }
}