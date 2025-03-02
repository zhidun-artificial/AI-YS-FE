import {
  addAgentes,
  AgenteItem,
  getModels
} from '@/services/agent';
import {
  getKnowledgeBases
} from '@/services/knowledge';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormRadio } from '@ant-design/pro-components';
import { Form, message, Radio } from 'antd';
import React, { PropsWithChildren, useState } from 'react';

import { Icon } from 'umi';
import type { CheckboxGroupProps } from 'antd/es/checkbox';


interface AddAgentProps {
  modalVisible: boolean;
  onClose: () => void;
}

const AddAgent: React.FC<PropsWithChildren<AddAgentProps>> = (props) => {
  const [form] = Form.useForm<AgenteItem>();

  const { modalVisible, onClose } = props;
  const [selectedIcon, setSelectedIcon] = useState<string>('local:wordRadio');

  const options: CheckboxGroupProps<string>['options'] = [
    { label: '私密', value: '1' },
    { label: '团队', value: '2' },
    { label: '公开', value: '0' },
  ];


  return (
    <ModalForm<AgenteItem>
      title="添加助理"
      form={form}
      open={modalVisible}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          setSelectedIcon('local:wordRadio')
          onClose();
        }
      }}
      width={600}
      submitTimeout={2000}
      onFinish={async (values) => {
        const res = await addAgentes({
          ...values,
          ext: { icon: selectedIcon }
        });
        if (res instanceof Error) {
          return false;
        }
        if (res.code === 0) {
          message.success('添加成功');
          // if (props.reload) props.reload();
          onClose();
          return true;
        }
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
        name="llmModel"
        rules={[{ required: true, message: '请选择基础模型' }]}
        label="基础模型（来自于） "
        request={async () => {

          try {
            const res = await getModels();
            if (res instanceof Error) {
              throw res;
            } else {
              return res.data.llm.map((item: any) => {
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
      <ProFormTextArea
        initialValue={''}
        name="description"
        label="助理介绍"
        placeholder="请输入助理介绍"
      />
      <ProFormTextArea
        initialValue={''}
        name="systemPrompt"
        required
        rules={[{ required: true, message: '请输入系统提示词' }]}
        label="系统提示词"
        placeholder="请输入系统提示词"
      />
      <ProFormSelect
        name="baseIds"
        mode="multiple"
        rules={[{ required: true, message: '请选择挂载知识库' }]}
        label="挂载知识库"
        request={async () => {
          const params = {
            key: '',
            pageNo: 1,
            pageSize: 9999
          }
          try {
            const res = await getKnowledgeBases(params);
            if (res instanceof Error) {
              throw res;
            } else {
              return res.data.records.map((item: any) => ({
                label: item.name,
                value: item.id
              }))
            }
          } catch (error) {
            message.error((error as Error).message);
            throw error;
          }
        }}
        placeholder="选择知识库 "
      />
      <ProFormRadio.Group
        label="可见权限"
        name="permit"
        initialValue="1"
        options={options}
      />
    </ModalForm>
  );
};

export default AddAgent;