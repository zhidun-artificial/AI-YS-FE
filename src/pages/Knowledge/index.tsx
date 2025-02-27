import { KnowledgeItem, getKnowledgeBases, KnowledgeRequest } from '@/services/knowledge';
import {
  PageContainer
} from '@ant-design/pro-components';
import {
  ClockCircleFilled,
  FolderFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  message
} from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Icon, history } from 'umi';
import './index.css';

const KnowledgePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const options: CheckboxGroupProps<string>['options'] = [
    { label: '私密', value: '私密' },
    { label: '团队', value: '团队' },
    { label: '公开', value: '公开' },
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
    }
  ];

  // 格式化时间戳的函数
  const formatTimestamp = (timestamp: any) => {
    return dayjs(timestamp).format('YYYY-MM-DD');
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = () => { };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getData = async (params: KnowledgeRequest) => {
    try {
      const res = await getKnowledgeBases(params);
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
  const onSearch = () => {
    const params = {
      key: '',
      pageNo: 1,
      pageSize: 20
    }
    getData(params);
  };
  onSearch();
  const toManagement = () => {
    history.push('/knowledge/setting');
  };
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      ghost
    >
      <div className="flex flex-col max-h-full">
        <div className="flex flex-col max-h-full">
          <div className="flex pb-6">
            <Input
              className="flex-1 h-[38px]"
              prefix={<Icon icon="local:search" />}
              suffix={
                <div className="flex gap-2">
                  <Icon className="cursor-pointer" icon="local:more" />
                  <Icon className="cursor-pointer" icon="local:setup" />
                </div>
              }
              placeholder="搜索知识库..."
            />
            <div className="flex justify-end w-1/3">
              <Button
                onClick={showModal}
                type="primary"
                icon={<PlusOutlined />}
              >
                新建上传
              </Button>
              <Modal
                okText="确认创建"
                cancelText="取消"
                width="384px"
                title="新建知识库"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    label="知识库名称"
                    name="name"
                    rules={[{ required: true, message: '请输入知识库名称' }]}
                  >
                    <Input placeholder="请输入知识库名称" />
                  </Form.Item>
                  <Form.Item label="知识库描述" name="description">
                    <Input.TextArea rows={4} placeholder="请输入知识库描述" />
                  </Form.Item>
                  <Form.Item label="可见权限" name="auth">
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
                  <Form.Item label="选择图标颜色" name="iconColor">
                    <Radio.Group block defaultValue="私密">
                      <Radio className="custom-radio" value={1}>
                        <div className="bg-[#3B82F6] w-8 h-8 rounded-full"></div>
                      </Radio>
                      <Radio className="custom-radio" value={2}>
                        <div className="bg-[#22C55E] w-8 h-8 rounded-full"></div>
                      </Radio>
                      <Radio className="custom-radio" value={2}>
                        <div className="bg-[#A855F7] w-8 h-8 rounded-full"></div>
                      </Radio>
                      <Radio className="custom-radio" value={2}>
                        <div className="bg-[#EF4444] w-8 h-8 rounded-full"></div>
                      </Radio>
                      <Radio className="custom-radio" value={2}>
                        <div className="bg-[#EAB308] w-8 h-8 rounded-full"></div>
                      </Radio>
                      <Radio className="custom-radio" value={2}>
                        <div className="bg-[#F97316] w-8 h-8 rounded-full"></div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="选择图标" name="icon">
                    <Radio.Group block defaultValue="私密">
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:wordRadio" />
                        </div>
                      </Radio>
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:codeRadio" />
                        </div>
                      </Radio>
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:bookRadio" />
                        </div>
                      </Radio>
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:toolRadio" />
                        </div>
                      </Radio>
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:defenceRadio" />
                        </div>
                      </Radio>
                      <Radio className="custom-radio" value={1}>
                        <div className="border border-[#E5E7EB] w-8 h-8 flex justify-center items-center">
                          <Icon icon="local:officeRadio" />
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(350px,_1fr))]">
            {cardData.map((item) => (
              <Card
                onClick={toManagement}
                key={item.id}
                className="text-[#6B7280] cursor-pointer"
              >
                <Icon
                  icon={(`local:${item.ext.tag}` || 'local:knowledge') as any}
                  className="absolute top-6 right-6 w-auto h-6"
                />
                <p className="text-[#111827] font-medium text-lg mb-1">
                  {item.name}
                </p>
                <p className="mb-5">{item.ext.remark}</p>
                <div className="flex flex-col gap-2">
                  <p className="flex items-center mb-0">
                    <Icon icon="local:person" className="mr-2.5" />
                    {item.creatorName} 创建
                  </p>
                  <p className="flex items-center mb-0">
                    <ClockCircleFilled className="mr-2.5" />
                    {formatTimestamp(item.createTime)} 创建
                  </p>
                  <p className="flex items-center mb-0">
                    <FolderFilled className="mr-2.5" />
                    包含 {item.docCount} 个文件
                  </p>
                </div>
                <div className="flex gap-2 pt-3">
                  <div className=" rounded-full h-6 px-2 text-xs leading-6 bg-[#DBEAFE] text-[#1D4ED8]">
                    新手指南
                  </div>
                  <div className=" rounded-full h-6 px-2 text-xs leading-6 bg-[#DCFCE7] text-[#15803D]">
                    规范制度
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="py-8 flex flex-col gap-5 text-[#6B7280] justify-center items-center ">
          <div className="flex justify-center items-center gap-4">
            <div>共 126 个知识库</div>
            <Select
              defaultValue="lucy"
              style={{ width: 130 }}
              options={[{ value: 'lucy', label: '每页显示 6 个' }]}
            />
            <div>当前第 1-6 个</div>
          </div>
          <Pagination
            showSizeChanger={false}
            showQuickJumper={{
              goButton: <Button className='ml-2'>确定</Button>,
            }}
            locale={
              {
                // 自定义“Go to Page”文案
                jump_to: '跳转至',
                page: '页'
              }
            }
            defaultCurrent={1}
            total={500}
            onChange={onChange}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export default KnowledgePage;