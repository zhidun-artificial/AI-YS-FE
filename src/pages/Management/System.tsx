import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message } from 'antd';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const SystemPage: React.FC = () => {
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
        title: '基础设置',
      }}
    >
      <ProForm<{
        name: string;
        company?: string;
        useMode?: string;
      }>
        layout={'vertical'}
        submitter={{
          searchConfig: {
            resetText: '取消',
            submitText: '保存设置',
          },
          render: (props, doms) => {
            return doms;
          },
        }}
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values);
          message.success('提交成功');
        }}
        params={{}}
        request={async () => {
          await waitTime(100);
          return {
            name: '智慧助手系统',
            prompt: '你是一个卓越的 AI 助手，名叫：小智，善于帮助用户解决问题',
          };
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="系统名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormUploadButton label="logo" name="logo" action="upload.do" />
        <ProFormTextArea
          colProps={{ span: 24 }}
          name="prompt"
          label="新对话默认提示词"
        />
      </ProForm>
    </PageContainer>
  );
};

export default SystemPage;
