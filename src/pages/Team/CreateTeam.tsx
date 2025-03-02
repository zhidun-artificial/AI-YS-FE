import ColorPicker from '@/components/ColorPikcer';
import { addTeam, updateTeam } from '@/services/team';
import {
  ModalForm,
  ProFormItem,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { message, TreeSelect } from 'antd';
import { useState } from 'react';
import { Icon } from 'umi';
import { IInitFormData, TreeDataType } from '.';

const CreateTeam = ({
  visible,
  update,
  initialValues,
  treeData,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  treeData: TreeDataType[];
  initialValues?: IInitFormData;
  update: () => void;
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState<string>('local:BUTTON1');

  return (
    <>
      <ModalForm
        width={480}
        open={visible}
        onOpenChange={(open) => setVisible(open)}
        onFinish={async (values: any) => {
          const params = {
            ...values,
            ext: { theme: selectedColor, icon: selectedIcon },
          };
          const res = initialValues?.id
            ? await updateTeam({ ...params, id: initialValues.id })
            : await addTeam(params);
          if (res instanceof Error) {
            message.error(res.message);
          } else {
            update();
            message.success(initialValues?.id ? '更新成功' : '提交成功');
            setVisible(false);
            return true;
          }
        }}
        initialValues={initialValues}
      >
        <ProFormText
          width="md"
          name="name"
          rules={[{ required: true, message: '请输入团队名称!' }]}
          label="团队名称"
          tooltip="最长为 24 位"
          placeholder="请输入团队名称"
        />
        <ProFormTreeSelect
          name="adminId"
          label="团队管理员"
          placeholder="搜索并选择管理员"
          rules={[{ required: true, message: '搜索并选择管理员!' }]}
          fieldProps={{
            treeData: treeData.map((item) => ({
              ...item,
              selectable: !item.children, // 仅叶子节点可选
            })),
            fieldNames: {
              label: 'title',
              value: 'value',
              children: 'children',
            },
            treeCheckable: false,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            treeDefaultExpandAll: true,
            treeNodeFilterProp: 'title',
            treeNodeLabelProp: 'title',
            multiple: false,
          }}
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
          <div className="flex flex-row gap-2">
            <Icon
              icon="local:BUTTON1"
              onClick={() => setSelectedIcon('local:BUTTON1')}
              className={`${selectedIcon === 'local:BUTTON1' ? 'border-blue-500 rounded-xl' : 'border-transparent'} border-2 cursor-pointer`}
            />
            <Icon
              icon="local:BUTTON3"
              onClick={() => setSelectedIcon('local:BUTTON3')}
              className={`${selectedIcon === 'local:BUTTON3' ? 'border-blue-500 rounded-xl' : 'border-transparent'} border-2 cursor-pointer`}
            />
            <Icon
              icon="local:BUTTON4"
              onClick={() => setSelectedIcon('local:BUTTON4')}
              className={`${selectedIcon === 'local:BUTTON4' ? 'border-blue-500 rounded-xl' : 'border-transparent'} border-2 cursor-pointer`}
            />
            <Icon
              icon="local:BUTTON5"
              onClick={() => setSelectedIcon('local:BUTTON5')}
              className={`${selectedIcon === 'local:BUTTON5' ? 'border-blue-500 rounded-xl' : 'border-transparent'} border-2 cursor-pointer`}
            />
            <Icon
              icon="local:BUTTON6"
              onClick={() => setSelectedIcon('local:BUTTON6')}
              className={`${selectedIcon === 'local:BUTTON6' ? 'border-blue-500 rounded-xl' : 'border-transparent'} border-2 cursor-pointer`}
            />
          </div>
        </ProFormItem>
      </ModalForm>
    </>
  );
};

export default CreateTeam;
