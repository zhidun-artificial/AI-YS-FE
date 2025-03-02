import {
  addKnowledgeBase,
  KnowledgeItem
} from '@/services/knowledge';
import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { Form, message, Button, Radio } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { Icon } from 'umi';
export default (props: {
  reload: () => void;
}) => {
  const [form] = Form.useForm<KnowledgeItem>();
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '私密', value: '私密' },
    { label: '团队', value: '团队' },
    { label: '公开', value: '公开' },
  ];
  return (
    <ModalForm<KnowledgeItem>
      title="新建知识库"
      trigger={
        <Button
          type="primary"
          icon={<PlusOutlined />}
        >
          新建上传
        </Button>}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={384}
      submitTimeout={2000}
      onFinish={async () => {
        const res = await addKnowledgeBase({
          ...form.getFieldsValue(),
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
        rules={[{ required: true, message: '请输入知识库名称' }]}
        label="知识库名称"
        tooltip="最长为 24 位"
        placeholder="请输入知识库名称"
      />
      <ProFormTextArea
        label="知识库描述"
        name="description"
        width="md"
        placeholder="请输入知识库描述"
      />
      <ProFormRadio.Group label="可见权限" name="auth" options={options} />
      <ProFormSelect
        name="tagCategory"
        label="标签分类"
        request={async () => [
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'tom',
            label: 'Tom',
          },
        ]}
        placeholder="请选择标签分类"
        rules={[{ required: true, message: '请选择标签分类' }]}
      />

      <Form.Item label="选择图标颜色" name="iconColor">
        <Radio.Group block defaultValue="私密">
          <Radio className="custom-radio" value={1}>
            <div className="bg-[#3B82F6] w-8 h-8 rounded-full"></div>
          </Radio>
          <Radio className="custom-radio" value={2}>
            <div className="bg-[#22C55E] w-8 h-8 rounded-full"></div>
          </Radio>
          <Radio className="custom-radio" value={2}>
            <div className="bg-[#A855F7] w-8 h-8 rounded-full"></div>
          </Radio>
          <Radio className="custom-radio" value={2}>
            <div className="bg-[#EF4444] w-8 h-8 rounded-full"></div>
          </Radio>
          <Radio className="custom-radio" value={2}>
            <div className="bg-[#EAB308] w-8 h-8 rounded-full"></div>
          </Radio>
          <Radio className="custom-radio" value={2}>
            <div className="bg-[#F97316] w-8 h-8 rounded-full"></div>
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="选择图标" name="icon">
        <Radio.Group block defaultValue="私密">
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:wordRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:codeRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:bookRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:toolRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:defenceRadio" />
            </div>
          </Radio>
          <Radio className="custom-radio" value={1}>
            <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
              <Icon icon="local:officeRadio" />
            </div>
          </Radio>
        </Radio.Group>
      </Form.Item>
    </ModalForm>
  );
};
