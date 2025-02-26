import { addTeam } from '@/services/team';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormItem,
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

const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {colorOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: option.value,
            border: value === option.value ? '2px solid blue' : 'none',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};

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

const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {iconOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            border: value === option.value ? '2px solid blue' : 'none',
            cursor: 'pointer',
          }}
        >
          <Icon
            icon={option.value as any}
            style={{ fill: value === option.value ? 'blue' : 'black' }}
          />
        </div>
      ))}
    </div>
  );
};

export default () => {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState<string>('local:knowledge');

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
            const res = await addTeam({
              ...values,
              ext: { theme: selectedColor, icon: selectedIcon },
            });
            if (res instanceof Error) {
              message.error(res.message);
            } else {
              message.success('提交成功');
            }
          }}
          initialValues={{
            name: '',
            theme: '#3B82F6',
            icon: 'local:knowledge',
          }}
        >
          <ProFormText
            width="md"
            name="name"
            rules={[{ required: true, message: '请输入团队名称!' }]}
            label="团队名称"
            tooltip="最长为 24 位"
            placeholder="请输入团队名称"
          />
          <ProFormSelect
            name="adminId"
            label="团队管理员"
            valueEnum={{
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5',
            }}
            placeholder="搜索并选择管理员"
            rules={[{ required: true, message: '搜索并选择管理员!' }]}
          />
          <ProFormTextArea
            colProps={{ span: 24 }}
            name="description"
            label="团队介绍"
            placeholder="请输入团队介绍"
            rules={[{ required: true, message: '请输入团队介绍!' }]}
          />
          <ProFormItem
            name="theme"
            label="主题色"
            valuePropName="value"
            trigger="onChange"
          >
            <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          </ProFormItem>
          <ProFormItem
            name="icon"
            label="团队图标"
            valuePropName="value"
            trigger="onChange"
          >
            <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
          </ProFormItem>
        </ModalForm>
      </div>
    </>
  );
};
