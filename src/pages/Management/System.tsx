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

  const handleBeforeUpload = (file: File) => {
    const isLt500KB = file.size / 1024 < 100;
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
        name: string;
        company?: string;
        useMode?: string;
        logo?: string;
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
          console.log({ ...values, logo });
          message.success('提交成功');
        }}
        params={{}}
        request={async (values) => {
          console.log(values);
          await waitTime(100);
          const logoBase64 =
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE0IDE2Ij48ZGVmcz48Y2xpcFBhdGggaWQ9Im1hc3Rlcl9zdmcwXzQxXzAzNTQzIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTQiIGhlaWdodD0iMTYiIHJ4PSIwIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI21hc3Rlcl9zdmcwXzQxXzAzNTQzKSI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMCwyMC4xODc1MTkwNzM0ODYzMjgpIj48Zz48cGF0aCBkPSJNLTAuMTI2OTUzMDA1NzkwNzEwNDUsMTEuODQzNzU5NTM2NzQzMTY0US0wLjA5NTEzNDgwNTc5MDcxMDQ2LDEyLjg0Mzc1OTUzNjc0MzE2NCwwLjc2Mzk1NTk5NDIwOTI4OTUsMTMuMzQzNzU5NTM2NzQzMTY0UTEuNjU0ODY2OTk0MjA5Mjg5NSwxMy44NDM3NTk1MzY3NDMxNjQsMi41NDU3NzY5OTQyMDkyODk2LDEzLjM0Mzc1OTUzNjc0MzE2NFEzLjQwNDg2Njk5NDIwOTI4OTcsMTIuODQzNzU5NTM2NzQzMTY0LDMuNDM2Njg2OTk0MjA5Mjg5NSwxMS44NDM3NTk1MzY3NDMxNjRRMy40MDQ4NjY5OTQyMDkyODk3LDEwLjg0Mzc1OTUzNjc0MzE2NCwyLjU0NTc3Njk5NDIwOTI4OTYsMTAuMzQzNzU5NTM2NzQzMTY0UTEuNjU0ODY2OTk0MjA5Mjg5NSw5Ljg0Mzc1OTUzNjc0MzE2NCwwLjc2Mzk1NTk5NDIwOTI4OTUsMTAuMzQzNzU5NTM2NzQzMTY0US0wLjA5NTEzNDgwNTc5MDcxMDQ2LDEwLjg0Mzc1OTUzNjc0MzE2NCwtMC4xMjY5NTMwMDU3OTA3MTA0NSwxMS44NDM3NTk1MzY3NDMxNjRaTTQuOTYzOTU2OTk0MjA5MjksMTEuODQzNzU5NTM2NzQzMTY0UTQuOTk1Nzc2OTk0MjA5Mjg5LDEyLjg0Mzc1OTUzNjc0MzE2NCw1Ljg1NDg2Njk5NDIwOTI4OTUsMTMuMzQzNzU5NTM2NzQzMTY0UTYuNzQ1Nzc2OTk0MjA5Mjg5LDEzLjg0Mzc1OTUzNjc0MzE2NCw3LjYzNjY4Njk5NDIwOTI4OSwxMy4zNDM3NTk1MzY3NDMxNjRROC40OTU3NzY5OTQyMDkyOSwxMi44NDM3NTk1MzY3NDMxNjQsOC41Mjc1ODY5OTQyMDkyOSwxMS44NDM3NTk1MzY3NDMxNjRROC40OTU3NzY5OTQyMDkyOSwxMC44NDM3NTk1MzY3NDMxNjQsNy42MzY2ODY5OTQyMDkyODksMTAuMzQzNzU5NTM2NzQzMTY0UTYuNzQ1Nzc2OTk0MjA5Mjg5LDkuODQzNzU5NTM2NzQzMTY0LDUuODU0ODY2OTk0MjA5Mjg5NSwxMC4zNDM3NTk1MzY3NDMxNjRRNC45OTU3NzY5OTQyMDkyODksMTAuODQzNzU5NTM2NzQzMTY0LDQuOTYzOTU2OTk0MjA5MjksMTEuODQzNzU5NTM2NzQzMTY0Wk0xMS44MzY2NDY5OTQyMDkyOSwxMy41OTM3NTk1MzY3NDMxNjRRMTIuODU0ODQ2OTk0MjA5MjksMTMuNTYyNTA5NTM2NzQzMTY0LDEzLjM2Mzk0Njk5NDIwOTI5LDEyLjcxODc1OTUzNjc0MzE2NFExMy44NzMwNDY5OTQyMDkyOSwxMS44NDM3NTk1MzY3NDMxNjQsMTMuMzYzOTQ2OTk0MjA5MjksMTAuOTY4NzU5NTM2NzQzMTY0UTEyLjg1NDg0Njk5NDIwOTI5LDEwLjEyNTAwOTUzNjc0MzE2NCwxMS44MzY2NDY5OTQyMDkyOSwxMC4wOTM3NTk1MzY3NDMxNjRRMTAuODE4NTQ2OTk0MjA5Mjg5LDEwLjEyNTAwOTUzNjc0MzE2NCwxMC4zMDk0NDY5OTQyMDkyOSwxMC45Njg3NTk1MzY3NDMxNjRROS44MDAzMTY5OTQyMDkyOSwxMS44NDM3NTk1MzY3NDMxNjQsMTAuMzA5NDQ2OTk0MjA5MjksMTIuNzE4NzU5NTM2NzQzMTY0UTEwLjgxODU0Njk5NDIwOTI4OSwxMy41NjI1MDk1MzY3NDMxNjQsMTEuODM2NjQ2OTk0MjA5MjksMTMuNTkzNzU5NTM2NzQzMTY0WiIgZmlsbD0iIzlDQTNBRiIgZmlsbC1vcGFjaXR5PSIxIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6cGFzc3Rocm91Z2giLz48L2c+PC9nPjwvZz48L3N2Zz4=';
          setLogo(logoBase64);
          return {
            name: '智慧助手系统',
            prompt: '你是一个卓越的 AI 助手，名叫：小智，善于帮助用户解决问题',
            // logo: logoBase64, // 这么返回报错
          };
        }}
      >
        <ProFormText
          width="md"
          name="name"
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
          name="prompt"
          label="新对话默认提示词"
        />
      </ProForm>
    </PageContainer>
  );
};

export default SystemPage;
