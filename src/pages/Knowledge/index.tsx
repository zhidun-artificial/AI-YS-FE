import { KnowledgeItem, getKnowledgeBases } from '@/services/knowledge';
import {
  PageContainer
} from '@ant-design/pro-components';
import AddKnowledge from './components/AddKnowledge'
import {
  ClockCircleFilled,
  FolderFilled,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Pagination,
  Select,
  message,
  Empty
} from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { Icon } from 'umi';
import { history } from '@umijs/max';
;
import './index.css';

const KnowledgePage: React.FC = () => {

  const [knowledgeList, setknowledgeList] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  // 格式化时间戳的函数
  const formatTimestamp = (timestamp: any) => {
    return dayjs(timestamp).format('YYYY-MM-DD');
  };

  const onChange = () => {

  };



  const onSearch = async (keyword?: string) => {
    const params = {
      key: keyword || '',
      pageNo: 1,
      pageSize: 20
    }
    try {
      const res = await getKnowledgeBases(params);
      if (res instanceof Error) {
        throw res;
      } else {
        setknowledgeList(res.data.records);
        setTotal(res.data.total);
      }
    } catch (error) {
      message.error((error as Error).message);
      throw error;
    }

  };
  useEffect(() => {
    onSearch('');
  }, []);
  const toManagement = (id: string) => {
    history.push('/knowledge/setting', { id });
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
            <Input.Search
              className="flex-1 h-[38px]"
              onSearch={onSearch}
              enterButton={false}
              prefix={<Icon icon="local:search" />}
              // suffix={
              //   <div className="flex gap-2">
              //     <Icon className="cursor-pointer" icon="local:more" />
              //     <Icon className="cursor-pointer" icon="local:setup" />
              //   </div>
              // }
              placeholder="搜索知识库..."
            />
            <div className="flex justify-end w-1/3">
              <AddKnowledge reload={onSearch} />
            </div>
          </div>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(350px,_1fr))]">
            {knowledgeList.map((item) => (
              <Card
                onClick={() => toManagement(item.id || '')}
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
                <p className="mb-5">{item.ext?.description as any}</p>
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
          {

            knowledgeList.length === 0 && <div className='flex justify-center'>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          }
        </div>
        <div className="py-8 flex flex-col gap-5 text-[#6B7280] justify-center items-center ">
          <div className="flex justify-center items-center gap-4">
            <div>共 {total} 个知识库</div>
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
            total={total}
            onChange={onChange}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export default KnowledgePage;