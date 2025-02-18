import { renameDocument } from '@/services/documents/searchDocuments';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';

export default (props: {
  update: () => void;
  DocId: number;
  oldName: string;
}) => {
  const [form] = Form.useForm<{ name: string }>();
  return (
    <ModalForm<{
      name: string;
    }>
      title="修改文件名称"
      trigger={<Button type="link">重命名</Button>}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={300}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await renameDocument({
          id: props.DocId,
          name: values.name,
        });
        if (res instanceof Error) {
          return false;
        }
        if (res.code === 0) {
          message.success('重命名成功');
          props.update();
          return true;
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          initialValue={props.oldName}
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
