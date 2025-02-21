import { Icon } from 'umi';
import { useState, useRef } from 'react';
import {
  KnowledgeItem,
  getKnowledges
} from '@/services/knowledge';
import { Button, Input, Modal, Form, Select, Radio, Tabs, Popconfirm, message } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import type { TabsProps } from 'antd';
import './management.css';
import './index.css';
import {
  PlusOutlined,
} from '@ant-design/icons';

import type {
  ActionType,
  ProColumns,
  RequestData
} from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';
const AccessPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '私密', value: '私密' },
    { label: '团队', value: '团队' },
    { label: '公开', value: '公开' },
  ];
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '文献管理',
    },
    {
      key: '2',
      label: '知识库配置'
    }
  ];
  const columns: ProColumns<KnowledgeItem>[] = [
    {
      title: '文献名',
      dataIndex: 'fileName',
      ellipsis: true,
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '分块数',
      dataIndex: 'limit',
      sorter: true,
    },
    {
      title: '上传日期',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
    },
    {
      title: '上传人',
      key: 'person',
      dataIndex: 'person',
      sorter: true,
    },
    {
      title: '解析状态',
      key: 'analysis',
      dataIndex: 'analysis',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: () => [

        <Icon key="edit" width='14' icon="local:edit" />,
        <Popconfirm
          key="delete"
          title="删除确认"
          description="您确定要删除此知识库吗?"
          onConfirm={async () => {

          }}
          okText="是"
          cancelText="否"
        >
          <Button color="danger" variant="link">
            <Icon width='14' icon="local:delete" />
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const getData = async (params: {
    key: string;
    pageNo: number;
    pageSize: number;
  }): Promise<Partial<RequestData<KnowledgeItem>>> => {
    try {
      const res = await getKnowledges(params);
      if (res instanceof Error) {
        throw res;
      } else {
        return {
          data: res.data.records,
          success: true,
          total: res.data.total,
        };
      }
    } catch (error) {
      message.error((error as Error).message);
      throw error;
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = () => {

  }
  const handleOk = () => {

    setIsModalOpen(false);
  }
  const handleCancel = () => {

    setIsModalOpen(false);
  }

  const onSearch = () => {

  }
  return (

    <div className="w-full h-full p-6">
      <div className="flex flex-col max-h-full">
        <div className="flex max-h-full p-6 bg-white">
          <div className='flex flex-1 flex-col'>
            <Select
              className='w-[182px]'
              onChange={onChange}
              defaultValue="安全防范知识库"
              options={[
                {
                  value: '安全防范知识库',
                  label: '安全防范知识库',
                },

              ]}
            />
            <Tabs defaultActiveKey="1" tabBarGutter={16} items={items} onChange={onChange} />
          </div>
          <div className='flex justify-end w-1/2 gap-4'>
            <Input
              className='flex-1 h-[38px]'
              suffix={<Icon icon="local:search" />}
              placeholder="搜索当前知识库文献..." />
            <Button onClick={showModal} className='' type='primary' icon={<PlusOutlined />}>新建上传</Button>
            <Button type='primary' danger icon={<Icon width='14' icon="local:del" />}>批量删除</Button>
            <Modal okText="确认创建"
              cancelText="取消" width="384px" title="新建知识库" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <Form form={form} layout="vertical">
                <Form.Item
                  label="知识库名称"
                  name="name"
                  rules={[{ required: true, message: '请输入知识库名称' }]}
                >
                  <Input placeholder="请输入知识库名称" />
                </Form.Item>
                <Form.Item
                  label="知识库描述"
                  name="description"
                >
                  <Input.TextArea rows={4} placeholder="请输入知识库描述" />
                </Form.Item>
                <Form.Item
                  label="可见权限"
                  name="auth"
                >

                  <Radio.Group block options={options} defaultValue="私密" />
                </Form.Item>
                <Form.Item
                  label="标签分类"
                  name="tagCategory"
                  rules={[{ required: true, message: '请选择标签分类' }]}
                >
                  <Select
                    showSearch
                    placeholder="请选择标签分类"
                    optionFilterProp="label"
                    onChange={onChange}
                    onSearch={onSearch}
                    options={[
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
                  />
                </Form.Item>
                <Form.Item
                  label="选择图标颜色"
                  name="iconColor"
                >

                  <Radio.Group block defaultValue="私密" >
                    <Radio className="custom-radio" value={1}>
                      <div className='bg-[#3B82F6] w-8 h-8 rounded-full'></div>
                    </Radio>
                    <Radio className="custom-radio" value={2}>
                      <div className='bg-[#22C55E] w-8 h-8 rounded-full'></div>
                    </Radio>
                    <Radio className="custom-radio" value={2}>
                      <div className='bg-[#A855F7] w-8 h-8 rounded-full'></div>
                    </Radio>
                    <Radio className="custom-radio" value={2}>
                      <div className='bg-[#EF4444] w-8 h-8 rounded-full'></div>
                    </Radio>
                    <Radio className="custom-radio" value={2}>
                      <div className='bg-[#EAB308] w-8 h-8 rounded-full'></div>
                    </Radio>
                    <Radio className="custom-radio" value={2}>
                      <div className='bg-[#F97316] w-8 h-8 rounded-full'></div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="选择图标"
                  name="icon"
                >

                  <Radio.Group block defaultValue="私密">
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:wordRadio" />
                      </div>
                    </Radio>
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:codeRadio" />
                      </div>
                    </Radio>
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:bookRadio" />
                      </div>
                    </Radio>
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:toolRadio" />
                      </div>
                    </Radio>
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:defenceRadio" />
                      </div>
                    </Radio>
                    <Radio className="custom-radio" value={1}>
                      <div className='border border-[#E5E7EB] w-8 h-8 flex justify-center items-center'>
                        <Icon icon="local:officeRadio" />
                      </div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <div className='flex-1'>
          <ProTable<KnowledgeItem>
            rowSelection={{}}
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params) => {
              return getData({
                key: params.fileName ?? '',
                pageNo: params.current ?? 1,
                pageSize: params.pageSize ?? 10,
              });
            }}
            editable={{
              type: 'multiple',
            }}
            columnsState={{
              persistenceKey: 'pro-table-singe-demos',
              persistenceType: 'localStorage',
              defaultValue: {
                option: { fixed: 'right', disable: true },
              },
              onChange(value) {
                console.log('value: ', value);
              },
            }}
            rowKey="id"
            search={false}
            options={false}
            pagination={{
              pageSize: 10,
              onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle=""
          />
        </div>
      </div>
    </div>
  )
}

export default AccessPage;