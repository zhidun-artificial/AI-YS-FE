import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useState } from 'react';
import { Icon } from 'umi';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const colorOptions = [
  {
    label: '蓝色',
    value: '#3B82F6',
  },
  {
    label: '紫色',
    value: '#A855F7',
  },
  {
    label: '绿色',
    value: '#22C55E',
  },
];

const iconOptions = [
  {
    label: '🐝',
    value: 'local:knowledge',
  },
  {
    label: '🐞',
    value: 'local:search',
  },
  {
    label: '🐌',
    value: 'local:chat',
  },
];

export default () => {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');

  return (
    <>
      <div>
        <ModalForm
          // @ts-ignore
          labelWidth="auto"
          width={480}
          trigger={
            <Button icon={<PlusOutlined />} className="ml-3">
              新建团队
            </Button>
          }
          onFinish={async (values: any) => {
            await waitTime(2000);
            console.log(values);
            message.success('提交成功');
          }}
          initialValues={{
            name: '',
            theme: '#3B82F6',
          }}
        >
          <ProFormText
            width="md"
            name="name"
            label="团队名称"
            tooltip="最长为 24 位"
            placeholder="请输入团队名称"
          />
          <ProFormSelect
            name="manager"
            label="团队管理员"
            valueEnum={{
              open: '未解决',
              closed: '已解决',
            }}
            placeholder="搜索并选择管理员"
            rules={[{ required: true, message: 'Please select your country!' }]}
          />
          <ProFormTextArea
            colProps={{ span: 24 }}
            name="desc"
            label="团队介绍"
            placeholder="请输入团队介绍"
          />
          <ProFormRadio.Group
            name="theme"
            label="主题色"
            options={colorOptions.map((option) => ({
              ...option,
              label: (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: option.value,
                    border:
                      selectedColor === option.value
                        ? '2px solid blue'
                        : 'none',
                  }}
                />
              ),
            }))}
            fieldProps={{
              onChange: (e) => setSelectedColor(e.target.value),
            }}
          />
          <ProFormRadio.Group
            name="icon"
            label="团队图标"
            options={iconOptions.map((option) => ({
              ...option,
              label: (
                <div
                  className={`w-8 h-8 rounded `}
                  style={{ backgroundColor: selectedColor }}
                >
                  <Icon
                    // @ts-ignore
                    icon={option.value}
                  />
                </div>
              ),
            }))}
            fieldProps={{
              onChange: (e) => setSelectedColor(e.target.value),
            }}
          />
        </ModalForm>
      </div>
    </>
  );
};
