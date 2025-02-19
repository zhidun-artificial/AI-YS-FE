import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';

const SystemPage: React.FC = () => {
  const access = useAccess();
  return (
    <PageContainer
      style={{ height: '100%', overflow: 'auto' }}
      ghost
      header={{
        title: '系统设置',
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access>
    </PageContainer>
  );
};

export default SystemPage;
