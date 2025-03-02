import { Icon } from 'umi';

import { useLocation } from '@umijs/max';
import { useState, useRef, useEffect } from 'react';
import {
  DocumentItem,
  getDocuments,
  deleteDocument,
  batchDeleteDocument
} from '@/services/knowledge/management';
import ColorPicker from '@/components/ColorPikcer';
import {
  KnowledgeItem,
  getKnowledgeBases,
  getTags
} from '@/services/knowledge';
import { Input, Modal, Form, Radio, Tabs, Popconfirm, message, Dropdown, Empty } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import type { TabsProps, MenuProps } from 'antd';
import './management.css';
import './index.css';
import {
  DownOutlined
} from '@ant-design/icons';
import RenameDocument from './components/RenameDocument';
import UploadFile from './components/UploadFile';

import type {
  ActionType,
  ProColumns,
  RequestData
} from '@ant-design/pro-components';
import {
  ProTable,
  PageContainer,
  ProFormText, ProFormTextArea, ProFormRadio, ProFormSelect
} from '@ant-design/pro-components';

const KnowledgeManagement: React.FC = () => {
  const location = useLocation(); // 获取路由参数
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tabType, setTabType] = useState('1');
  const [knowledgeList, setknowledgeList] = useState<KnowledgeItem[]>([]);

  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState<string>('local:wordRadio');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target as Node) && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const [currentId, setCurrentId] = useState('');
  const [form] = Form.useForm();
  const searchKnowledge = async (keyword: string) => {
    const params = {
      key: keyword,
      pageNo: 1,
      pageSize: 9999
    }
    try {
      const res = await getKnowledgeBases(params);
      if (res instanceof Error) {
        throw res;
      } else {
        setknowledgeList(res.data.records)
      }
    } catch (error) {
      message.error((error as Error).message);
      throw error;
    }
  };
  // 使用 useEffect 监听全局点击事件
  useEffect(() => {
    searchKnowledge('');

    const { id } = location.state as { id: string };
    setCurrentId(id);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);



  const [searchText, setSearchText] = useState('');
  const options: CheckboxGroupProps<number>['options'] = [
    { label: '私密', value: 1 },
    { label: '团队', value: 2 },
    { label: '公开', value: 0 },
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

  const menus: MenuProps['items'] = [
    {
      label: '批量解析',
      key: '1',
    },
  ];

  const columns: ProColumns<DocumentItem>[] = [
    {
      title: '文献名',
      dataIndex: 'title',
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
      render: (text, record, _, action) => [
        <RenameDocument
          key="edit"
          id={record.id}
          name={record.title}
          reload={action?.reload}
        />,
        <Popconfirm
          key="delete"
          title="删除确认"
          description="您确定要删除此文献吗?"
          onConfirm={async () => {
            const res = await deleteDocument(record.id);
            if (res instanceof Error) {
              return;
            } else {
              message.success('删除成功');
              action?.reload();
            }
          }}
          okText="是"
          cancelText="否"
        >

          <Icon width='14' className='cursor-pointer' icon="local:delete" />
        </Popconfirm>,
      ],
    },
  ];

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const getData = async (params: {
    baseId: string;
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

  const onChange = (type: string) => {
    setTabType(type);

  }
  useEffect(() => {
    if (tabType === '2') {
      const item = knowledgeList.find((item: KnowledgeItem) => item.id === currentId);
      form.setFieldsValue(item);
      setSelectedIcon(item?.ext?.icon as string || 'local:folder');

    }
  }, [tabType]);
  const handleOk = () => {
    setIsModalOpen(false);
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const onSearch = (key: string) => {
    setSearchText(key);
    actionRef.current?.reload()
  }


  const onSelectChange = (newSelectedRows: any[]) => {
    setSelectedRows(newSelectedRows);
    console.log('选中的行数据：', selectedRows);
  };


  const getBatchDeleteDocument = async () => {
    if (selectedRows.length === 0) {
      message.error('请先选择要删除的文献');
      return;
    }
    // 批量删除逻辑
    const res = await batchDeleteDocument(selectedRows);
    if (res instanceof Error) {
      return;
    } else {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }



  const knowledgeSelect = (item: KnowledgeItem) => {
    setCurrentId(item.id || '');
    actionRef.current?.reload();

    form.setFieldsValue(item)
    setSelectedIcon(item?.ext?.icon as string || 'local:folder');
  }
  const handleButtonClick = () => {
    getBatchDeleteDocument();
  }
  const rowSelection = {
    onChange: onSelectChange,
  };
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
            <div ref={triggerRef} onClick={toggleDropdown} className='border !w-[182px] py-2 flex px-4 cursor-pointer'>
              <span className='flex-1 text-lg font-medium'>{knowledgeList.find(item => item.id === currentId)?.name || '全部知识库'}</span>
              <DownOutlined className='w-3' />
            </div>
            <Tabs defaultActiveKey="1" tabBarGutter={16} items={items} onChange={onChange} />
            {
              isOpen && (
                <div ref={dropdownRef} className='absolute top-24 mt-2 z-10 !w-[298px] max-h-52 bg-white border rounded-xl px-2 pt-1 pb-2'>
                  <Input.Search
                    className='h-[38px]'
                    onSearch={searchKnowledge}
                    suffix={<Icon icon="local:search" />}
                    placeholder="搜索知识库..." />
                  <div className='flex-1 grid grid-cols-2 pt-2 pr-7 gap-2'>
                    {knowledgeList.map((item) => (
                      <div key={item.id} onClick={() => knowledgeSelect(item)} className={`border rounded text-center cursor-pointer py-2 ${item.id === currentId ? ' bg-indigo-600 text-white' : ''}`} >
                        {item.name}
                      </div>
                    ))
                    }
                  </div>
                  {
                    knowledgeList.length === 0 && <div className='flex justify-center'>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  }
                </div>
              )
            }

          </div>
          <div className='flex justify-end  gap-4'>
            <Input.Search
              className='flex-1 h-[38px] !w-[280px]'
              onSearch={onSearch}
              enterButton={false}
              suffix={<Icon icon="local:search" />}
              placeholder="搜索当前知识库文献..." />

            <UploadFile baseId={currentId} reload={actionRef.current?.reload} />
            <Dropdown.Button className='!w-auto' type="primary" danger menu={{ items: menus }} placement="bottomRight" onClick={handleButtonClick}>
              <Icon width='14' icon="local:del" /> 批量删除
            </Dropdown.Button>
            <Modal okText="确认创建"
              cancelText="取消" width="384px" title="编辑文献" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

            </Modal>
          </div>
        </div>
        {tabType === '1' && <div className='flex-1'>
          <ProTable<DocumentItem>
            columns={columns}
            actionRef={actionRef}
            rowSelection={rowSelection}
            cardBordered
            request={async (params) => {
              return getData({
                key: searchText,
                baseId: currentId,
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
            <ProFormText
              width="md"
              name="name"
              required
              initialValue={''}
              rules={[{ required: true, message: '请输入知识库名称' }]}
              label="知识库名称"
              tooltip="最长为 24 位"
              placeholder="请输入知识库名称"
            />
            <ProFormTextArea
              label="知识库描述"
              name="description"
              initialValue={''}
              width="md"
              placeholder="请输入知识库描述"
            />
            <ProFormRadio.Group
              initialValue={1} disabled label="可见权限" name="permit" options={options} />
            <ProFormSelect
              name="tags"
              mode='multiple'
              label="标签分类"
              request={async () => {

                try {
                  const res = await getTags();
                  if (res instanceof Error) {
                    throw res;
                  } else {
                    return res.data.map((item: any) => {
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
              placeholder="请选择标签分类"
              rules={[{ required: true, message: '请选择标签分类' }]}
            />
            <Form.Item label="选择图标颜色" name="iconColor">

              <div>
                <span className=' hidden'>{selectedColor}</span>
                <ColorPicker
                  value={selectedColor}
                  onChange={setSelectedColor}
                  colorOptions={[
                    '#3B82F6',
                    '#22C55E',
                    '#A855F7',
                    '#EF4444',
                    '#EAB308',
                    '#F97316',
                  ]}
                ></ColorPicker>
              </div>
            </Form.Item>
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
          </Form>
        }

      </div>
    </PageContainer>
  )
}

export default KnowledgeManagement;