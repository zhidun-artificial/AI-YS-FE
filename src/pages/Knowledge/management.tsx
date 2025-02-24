import { Icon } from 'umi';
import { useState, useRef, useEffect } from 'react';
import {
  DocumentItem,
  getDocuments
} from '@/services/knowledge/management';
import {
  KnowledgeItem
} from '@/services/knowledge';
import { Button, Input, Modal, Form, Select, Radio, Tabs, Popconfirm, message } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import type { TabsProps } from 'antd';
import './management.css';
import './index.css';
import {
  PlusOutlined,
  DownOutlined
} from '@ant-design/icons';

import type {
  ActionType,
  ProColumns,
  RequestData
} from '@ant-design/pro-components';
import {
  ProTable,
  PageContainer
} from '@ant-design/pro-components';
const KnowledgeManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tabType, setTabType] = useState('1');
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // 使用 useEffect 监听全局点击事件
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [currentId] = useState('1');
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

  const cardData: KnowledgeItem[] = [
    {
      id: '1',
      name: '安全防范知识库',
      creatorName: '系统管理员',
      docCount: 32,
      ext: {}
    },
    {
      id: '71',
      name: '系统管理员',
      docCount: 32,
      ext: {}
    },
    {
      id: '713',
      name: '基础知识库',
      creatorName: '系统管理员',
      docCount: 32,
      ext: {}
    },
  ];
  const columns: ProColumns<DocumentItem>[] = [
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
      key: 'creatorName',
      dataIndex: 'creatorName',
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

        <Icon key="edit" width='14' className='cursor-pointer' icon="local:edit" />,
        <Popconfirm
          key="delete"
          title="删除确认"
          description="您确定要删除此知识库吗?"
          onConfirm={async () => {

          }}
          okText="是"
          cancelText="否"
        >

          <Icon width='14' className='cursor-pointer' icon="local:delete" />
        </Popconfirm>,
      ],
    },
  ];

  const getData = async (params: {
    key: string;
    pageNo: number;
    pageSize: number;
  }): Promise<Partial<RequestData<DocumentItem>>> => {
    try {
      const res = await getDocuments(params);
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
  const onChange = (type: string) => {
    setTabType(type)
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
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      ghost>
      <div className="flex flex-col  w-full h-full">
        <div className="flex relative">
          <div className='flex flex-1 flex-col'>
            <div onClick={toggleDropdown} className='border w-[182px] py-2 flex px-4 cursor-pointer'>
              <span className='flex-1 text-lg font-medium'>{'安全防范知识库'}</span>
              <DownOutlined className='w-3' />
            </div>
            <Tabs defaultActiveKey="1" tabBarGutter={16} items={items} onChange={onChange} />
            {
              isOpen && (
                <div ref={dropdownRef} className='absolute top-32 z-10 w-[298px] bg-white border rounded-xl px-2 pt-1 pb-2'>
                  <Input
                    className='h-[38px]'
                    suffix={<Icon icon="local:search" />}
                    placeholder="搜索知识库..." />
                  <div className='flex-1 grid grid-cols-2 pt-2 pr-7 gap-2'>
                    {cardData.map((item) => (
                      <div key={item.id} className={`border rounded text-center cursor-pointer py-2 ${item.id === currentId ? ' bg-indigo-600 text-white' : ''}`} >
                        {item.name}
                      </div>
                    ))
                    }
                  </div>
                </div>
              )
            }

          </div>
          <div className='flex justify-end  gap-4'>
            <Input
              className='flex-1 h-[38px] w-[280px]'
              suffix={<Icon icon="local:search" />}
              placeholder="搜索当前知识库文献..." />
            <Button onClick={showModal} className='' type='primary' icon={<PlusOutlined />}>新建上传</Button>
            <Button type='primary' danger icon={<Icon width='14' icon="local:del" />}>批量删除</Button>
            <Modal okText="确认创建"
              cancelText="取消" width="384px" title="编辑文献" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

            </Modal>
          </div>
        </div>
        {tabType === '1' && <div className='flex-1'>
          <ProTable<DocumentItem>
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
        </div>}
        {tabType === '2' &&
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
        }

      </div>
    </PageContainer>
  )
}

export default KnowledgeManagement;