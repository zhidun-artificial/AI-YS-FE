import ColorPicker from '@/components/ColorPikcer';
import IconPicker from '@/components/IconPicker';
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

export default ({ update }: { update: () => void }) => {
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
              update();
              message.success('提交成功');
              return true;
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
            <ColorPicker
              value={selectedColor}
              onChange={setSelectedColor}
              colorOptions={[
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
              ]}
            />
          </ProFormItem>
          <ProFormItem
            name="icon"
            label="团队图标"
            valuePropName="value"
            trigger="onChange"
          >
            <IconPicker
              value={selectedIcon}
              onChange={setSelectedIcon}
              iconOptions={['local:knowledge', 'local:team']}
            />
          </ProFormItem>
        </ModalForm>
      </div>
    </>
  );
};
