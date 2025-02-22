import {
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormSlider,
  ProFormText,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { message } from 'antd';

const ModelPage: React.FC = () => {
  const access = useAccess();
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: '#fff',
        borderRadius: '12px',
      }}
      ghost
      header={{
        title: '模型管理',
      }}
    >
      {/* <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access> */}
      <ProForm<{
        name: string;
        company: string;
      }>
        onFinish={async (values) => {
          console.log(values);
          message.success('提交成功');
        }}
        initialValues={{}}
      >
        <ProFormSelect
          name="select"
          label="模型提供方"
          width={672}
          valueEnum={{
            open: '未解决',
            closed: '已解决',
          }}
          placeholder="Please select a country"
          rules={[{ required: true, message: 'Please select your country!' }]}
        />
        <ProFormText
          name="api"
          width={672}
          label="API 域名"
          placeholder="请输入名称"
        />
        <ProFormSelect
          name="modal"
          label="默认模型"
          width={672}
          valueEnum={{
            open: '未解决',
            closed: '已解决',
          }}
          placeholder="Please select a country"
          rules={[{ required: true, message: 'Please select your country!' }]}
        />
        <ProFormSlider width={672} name="context" label="上下文消息数量上限" />
        <ProFormSlider
          name="slider"
          width={672}
          min={0}
          max={1}
          step={0.1}
          label="严谨与想象（Temperature）"
        />
      </ProForm>
    </PageContainer>
  );
};

export default ModelPage;
