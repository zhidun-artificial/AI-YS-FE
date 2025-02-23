import {
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormSlider,
  ProFormText,
} from '@ant-design/pro-components';
// import { useAccess } from '@umijs/max';
import { message } from 'antd';

const ModelPage: React.FC = () => {
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      ghost
    >
      <ProForm<{
        user?: string;
        api?: string;
        model?: string;
      }>
        layout={'vertical'}
        submitter={{
          searchConfig: {
            submitText: '保存设置',
          },
          render: (props, doms) => {
            return doms;
          },
          resetButtonProps: {
            style: {
              // 隐藏重置按钮
              display: 'none',
            },
          },
        }}

        onFinish={(values) => {
          console.log(values);
          message.success('提交成功');
        }}
        params={{}}
        request={async () => {
          return {
            user: 'Ollama API',
            api: 'https://api.deepseek.com',
            model: 'DeepSeek-R1:70B'
          };
        }}
      >
        <ProFormSelect
          options={[
            {
              value: 'Ollama API',
              label: 'Ollama API',
            },
          ]}
          width="xl"
          name="user"
          label="模型提供方"
        />
        <ProFormText
          width="xl"
          name="api"
          label="API 域名"
          placeholder="请输入API 域名"
        />
        <ProFormSelect
          options={[
            {
              value: 'DeepSeek-R1:70B',
              label: 'DeepSeek-R1:70B',
            },
          ]}
          width="xl"
          name="model"
          label="默认模型"
        />
        <ProFormSlider filedConfig={{ ignoreWidth: false }}
          min={0}
          max={20}
          marks={{
            20: {
              label: <span>20</span>
            }
          }}
          step={1} width="md" name="max" label="上下文消息数量上限" />
        <ProFormSlider
          filedConfig={{ ignoreWidth: false }}
          min={0}
          max={1}
          marks={{
            1: {
              label: <span>1</span>
            }
          }}
          step={0.1} width="md" name="switch" label="严谨与想象（Temperature）" />

      </ProForm>
    </PageContainer>
  );
};

export default ModelPage;
