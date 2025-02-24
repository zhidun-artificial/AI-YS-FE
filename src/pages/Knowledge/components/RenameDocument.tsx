import {
  updateDocument
} from '@/services/knowledge/management';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { Icon } from 'umi';
export default (props: {
  reload: (() => Promise<void>) | undefined;
  id: string;
  name: string;
}) => {
  const [form] = Form.useForm<{ name: string }>();
  return (
    <ModalForm<{
      name: string;
    }>
      title="修改文件名称"
      trigger={<Icon width='14' className='cursor-pointer' icon="local:edit" />}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={300}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await updateDocument({
          id: props.id,
          name: values.name,
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
      <ProForm.Group>
        <ProFormText
          initialValue={props.name}
          width="md"
          name="name"
          required
          rules={[{ required: true, message: '请输入名称' }]}
          label="新文件名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
      </ProForm.Group>
    </ModalForm>
  );
};
