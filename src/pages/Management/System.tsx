import { getSystemConfig, ISystem, setSystemConfig } from '@/services/system';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message, UploadFile } from 'antd';
import { useState } from 'react';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SystemPage: React.FC = () => {
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [initialValues, setInitialValues] = useState<{
    systemName: string;
    logo: string;
    defaultPrompt: string;
  }>({
    systemName: '',
    logo: '',
    defaultPrompt: '',
  });

  const handleBeforeUpload = (file: File) => {
    const isLt500KB = file.size / 1024 < 500;
    if (!isLt500KB) {
      message.error('图片大小不能超过 500KB!');
    }
    return isLt500KB;
  };

  const handleChange = async (info: { file: UploadFile }) => {
    if (info.file.status === 'done') {
      const base64 = await getBase64(info.file.originFileObj as File);
      setLogo(base64);
    }
  };

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
        systemName: string;
        logo: string;
        defaultPrompt: string;
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
          const res = await setSystemConfig({ ...values, logo } as ISystem);
          if (res instanceof Error) {
            message.error('保存失败');
          } else {
            message.success('保存成功');
          }
        }}
        onReset={() => {
          setLogo(initialValues.logo);
        }}
        params={{}}
        request={async () => {
          const res = (await getSystemConfig()) as any;
          // 设置默认图标
          const logoBase64 =
            'data:image/png;base64,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';
          const { systemName, logo = logoBase64, defaultPrompt } = res.data;
          console.log(systemName, logo, defaultPrompt);
          setLogo(logo);
          setInitialValues({ systemName, logo, defaultPrompt });
          return {
            systemName,
            defaultPrompt,
          };
        }}
      >
        <ProFormText
          width="md"
          name="systemName"
          label="系统名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true, message: '系统名称必填' }]}
        />
        <ProFormUploadButton
          label="logo"
          name="logo"
          fieldProps={{
            beforeUpload: handleBeforeUpload,
            onChange: handleChange,
            maxCount: 1,
            showUploadList: false,
          }}
          rules={[{ required: true, message: 'logo 必填' }]}
        />
        {logo && (
          <img
            src={logo}
            alt="logo"
            style={{ width: '100px', marginTop: '10px', marginBottom: '24px' }}
          />
        )}
        <ProFormTextArea
          colProps={{ span: 24 }}
          name="defaultPrompt"
          label="新对话默认提示词"
        />
      </ProForm>
    </PageContainer>
  );
};

export default SystemPage;
