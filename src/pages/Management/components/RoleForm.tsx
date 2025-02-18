import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button } from 'antd';

interface SensitiveFormProps {
  title: string;
  id: number | string;
  onFinish: (params: { name: string; remarks: string }) => void;
}

const SensitiveForm: React.FC<SensitiveFormProps> = (props) => {
  return (
    <ModalForm
      key={1}
      {...{
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      }}
      title="编辑角色"
      width={456}
      layout="horizontal"
      trigger={
        <Button color="primary" variant="link">
          编辑
        </Button>
      }
      onFinish={async (values) => {
        props.onFinish({ name: values.name, remarks: values.remarks });
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="name"
        rules={[{ required: true, message: '请输入名称' }]}
        label="角色名称"
        placeholder="请输入名称"
      />

      <ProFormTextArea
        fieldProps={{ rows: 6 }}
        width="md"
        name="remarks"
        label="备注"
        placeholder="请输入"
      />
    </ModalForm>
  );
};

export default SensitiveForm;
