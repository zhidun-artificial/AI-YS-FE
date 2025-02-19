import { updateLibrarie } from '@/services/libraries/searchLibraries';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';

export default (props: {
  libraryId: number;
  oldName: string;
  updateOptions: () => void;
}) => {
  const [form] = Form.useForm<{ name: string }>();
  return (
    <ModalForm<{
      name: string;
    }>
      title="编辑专题库"
      trigger={
        <Button color="primary" variant="link">
          编辑
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={300}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await updateLibrarie({
          id: props.libraryId,
          name: values.name,
        });
        if (res instanceof Error) {
          return false;
        }
        if (res.code === 0) {
          message.success('编辑成功');
          props.updateOptions();
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
          label="专题库"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
      </ProForm.Group>
    </ModalForm>
  );
};
