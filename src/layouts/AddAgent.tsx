import {
  // addAgentes
  AgenteItem
} from '@/services/agent';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormRadio } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { PropsWithChildren } from 'react';


interface AddAgentProps {
  modalVisible: boolean;
  onClose: () => void;
}
const AddAgent: React.FC<PropsWithChildren<AddAgentProps>> = (props) => {
  const [form] = Form.useForm<AgenteItem>();

  const { modalVisible, onClose } = props;

  return (
    <ModalForm<AgenteItem>
      title="添加助理"
      form={form}
      open={modalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel: onClose
      }}
      width={600}
      submitTimeout={2000}
      onFinish={async () => {
        //   const res = await addAgentes({
        //     name: values.name,
        //   });
        //   if (res instanceof Error) {
        //     return false;
        //   }
        //   if (res.code === 0) {
        message.success('重命名成功');
        //     if (props.reload) props.reload();
        onClose();
        //     return true;
        //   }
      }}
    >
      <ProFormText
        name="name"
        required
        rules={[{ required: true, message: '请输入名称' }]}
        label="新文件名称"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormSelect
        name="select2"
        label="基础模型（来自于） "
        request={async () => [
          { label: 'DeepSeek-R1:70B ', value: 'DeepSeek-R1:70B ' }
        ]}
        placeholder="基础模型"
        rules={[{ required: true, message: '基础模型!' }]}
      />
      <ProFormSelect
        name="select2"
        label="选择表情"
        request={async () => [
          { label: 'DeepSeek-R1:70B ', value: 'DeepSeek-R1:70B ' }
        ]}
        placeholder="基础模型"
        rules={[{ required: true, message: '基础模型!' }]}
      />
      <ProFormTextArea
        initialValue={name}
        name="name"
        required
        rules={[{ required: true, message: '请输入名称' }]}
        label="助理介绍"
        placeholder="请输入名称"
      />
      <ProFormTextArea
        initialValue={name}
        name="name"
        required
        rules={[{ required: true, message: '系统提示词' }]}
        label="系统提示词"
        placeholder="请输入名称"
      />
      <ProFormSelect
        name="select2"
        label="挂载知识库"
        request={async () => [
          { label: 'DeepSeek-R1:70B ', value: 'DeepSeek-R1:70B ' }
        ]}
        placeholder="选择知识库 "
        rules={[{ required: true, message: '挂载知识库!' }]}
      />
      <ProFormRadio.Group
        label="可见权限"
        name="invoiceType"
        initialValue="私密"
        options={['私密', '团队', '公开']}
      />
    </ModalForm>
  );
};

export default AddAgent;