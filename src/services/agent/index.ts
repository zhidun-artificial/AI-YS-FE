export const getAgents = async () => {
  return new Promise((resolve) => {
    // setTimeout 模拟异步请求
    setTimeout(() => {
      resolve({
        code: 0,
        data: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
          { id: 3, name: '王五' },
        ],
      });
    }, 1000);
  });
};
