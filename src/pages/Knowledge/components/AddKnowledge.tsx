import {
  addKnowledgeBase,
  KnowledgeItem,
  getTags
} from '@/services/knowledge';
import { getModels } from '@/services/agent';
import ColorPicker from '@/components/ColorPikcer';
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { Form, message, Button, Radio } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Icon } from 'umi';
import { useState } from 'react';
export default (props: {
  reload: () => void;
}) => {
  const [form] = Form.useForm<KnowledgeItem>();
  const options: CheckboxGroupProps<number>['options'] = [
    { label: '私密', value: 1 },
    { label: '团队', value: 2 },
    { label: '公开', value: 0 },
  ];

  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState<string>('local:wordRadio');


  return (
    <ModalForm<KnowledgeItem>
      title="新建知识库"
      trigger={
        <Button
          type="primary"
          icon={<PlusOutlined />}
        >
          新建知识库
        </Button>}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          setSelectedIcon('local:wordRadio')
          setSelectedColor('#3B82F6')
        },
      }}
      width={384}
      submitTimeout={2000}
      onFinish={async () => {
        const formData = form.getFieldsValue();
        const res = await addKnowledgeBase({
          ...formData,
          ext: { iconColor: selectedColor, icon: selectedIcon }
        });
        if (res instanceof Error) {
          return false;
        }
        if (res.code === 0) {
          message.success('重命名成功');
          if (props.reload) props.reload();
          return true;
        }
      }}
    >
      <ProFormText
        width="md"
        name="name"
        required
        initialValue={''}
        rules={[{ required: true, message: '请输入知识库名称' }]}
        label="知识库名称"
        tooltip="最长为 24 位"
        placeholder="请输入知识库名称"
      />
      <ProFormTextArea
        label="知识库描述"
        name="description"
        initialValue={''}
        width="md"
        placeholder="请输入知识库描述"
      />
      <ProFormSelect
        name="embedModel"
        rules={[{ required: true, message: '请选择嵌入模型' }]}
        label="嵌入模型"
        request={async () => {

          try {
            const res = await getModels();
            if (res instanceof Error) {
              throw res;
            } else {
              return res.data.embeddings.map((item: any) => {
                return {
                  label: item,
                  value: item
                }
              })
            }
          } catch (error) {
            message.error((error as Error).message);
            throw error;
          }
        }}
        placeholder="请选择"
      />
      <ProFormRadio.Group
        initialValue={1} label="可见权限" name="permit" options={options} />
      <ProFormSelect
        name="tags"
        mode='multiple'
        label="标签分类"
        request={async () => {

          try {
            const res = await getTags();
            if (res instanceof Error) {
              throw res;
            } else {
              return res.data.map((item: any) => {
                return {
                  label: item,
                  value: item
                }
              })
            }
          } catch (error) {
            message.error((error as Error).message);
            throw error;
          }
        }}
        placeholder="请选择标签分类"
        rules={[{ required: true, message: '请选择标签分类' }]}
      />

      <Form.Item label="选择图标颜色" name="iconColor">

        <div>
          <span className=' hidden'>{selectedColor}</span>
          <ColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
            colorOptions={[
              '#3B82F6',
              '#22C55E',
              '#A855F7',
              '#EF4444',
              '#EAB308',
              '#F97316',
            ]}
          ></ColorPicker>
        </div>
      </Form.Item>
      <Form.Item label="选择图标">
        <Radio.Group block defaultValue={selectedIcon}>
          <Radio className="custom-radio" value={'local:wordRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:wordRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={'local:codeRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:codeRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={'local:bookRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:bookRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={'local:toolRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:toolRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={'local:defenceRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:defenceRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={'local:officeRadio'}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:officeRadio" />
            </div>
          </Radio>
        </Radio.Group>
      </Form.Item>
    </ModalForm>
  );
};
