import { PageContainer } from '@ant-design/pro-components';

const Repository = () => {
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      ghost
      header={{
        title: '知识库统计',
      }}
    ></PageContainer>
  );
};

export default Repository;
