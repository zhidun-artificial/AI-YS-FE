import { PageContainer } from '@ant-design/pro-components';

const Resource = () => {
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
        title: '资源统计',
      }}
    ></PageContainer>
  );
};

export default Resource;
