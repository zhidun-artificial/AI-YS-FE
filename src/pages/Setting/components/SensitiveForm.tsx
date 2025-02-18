import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button } from 'antd';

interface SensitiveFormProps {
  title: string;
  id: number | string;
  onFinish: (blockedWord: string) => void;
}

const SensitiveForm: React.FC<SensitiveFormProps> = (props) => {
  return (
    <ModalForm
      key={1}
      {...{
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      }}
      title={props.title}
      width={456}
      layout="horizontal"
      trigger={
        <Button color="primary" variant="link">
          编辑
        </Button>
      }
      onFinish={async (values) => {
        props.onFinish(values.blockedWord as string);
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="blockedWord"
        rules={[{ required: true, message: '请输入名称' }]}
        label="屏蔽词"
        placeholder="请输入名称"
      />
    </ModalForm>
  );
};

export default SensitiveForm;
