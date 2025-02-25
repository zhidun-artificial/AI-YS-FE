import { SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { SelectProps } from 'antd';
import { Input, Segmented, Select, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import './index.css';

const options: SelectProps['options'] = [];

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type LibraryItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<LibraryItem>[] = [
  {
    title: '文件类型',
    dataIndex: 'labels',
    valueType: 'select',
    hideInTable: true,
    search: true,
    order: 3,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '文献名',
    dataIndex: 'title',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '上传时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    sorter: true,
    width: 200,
    order: 1,
  },
  {
    title: '上传人',
    key: 'creater',
    dataIndex: 'creater',
    sorter: true,
    width: 200,
    order: 2,
  },
];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const tagRender = (props: any) => {
  return (
    <span className="ml-4 text-[#4B5563] font-normal text-sm">
      {props.label}
    </span>
  );
};

export default function Search() {
  const actionRef = useRef<ActionType>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const handleSelectChange = (value: string[]) => {
    setSelectedItems(value);
    handleChange(value);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {!isSearching && (
        <section className="tips-card p-8 flex flex-col items-center mt-20 w-[672px] mx-auto rounded-[20px]">
          <span className="tips-title mb-4">智能文献搜索</span>
          <p className="w-[512px] text-center text-[#4B5563] text-base font-normal">
            通过先进的语义分析技术，精准理解您的搜索意图，快速定位知识库中的相关文献，让您的办公和学习更加高效自由。
            <span className="text-[#4F46E5]">✨ 让知识触手可及</span>
          </p>
        </section>
      )}
      <section className="mt-8 mx-auto">
        <Segmented<string>
          options={['语意检索', '关键词检索']}
          size="large"
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </section>
      <section className="mt-8 mx-auto flex flex-row">
        {/* <Space style={{ width: '100%' }} direction="horizontal"> */}
        <Select
          mode="multiple"
          size="large"
          allowClear
          style={{ width: '270px' }}
          placeholder="请选择"
          value={selectedItems}
          onChange={handleSelectChange}
          options={options}
          maxTagCount={0}
          maxTagPlaceholder={() => `已选择 ${selectedItems.length} 个知识库`}
          tagRender={tagRender}
        />
        <Input
          className="w-[500px] ml-4"
          size="large"
          placeholder="请输入"
          prefix={<SearchOutlined />}
        />
        {/* </Space> */}
      </section>
      <ProTable<LibraryItem>
        style={{ padding: 16 }}
        key="library"
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);
          return [];
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
        search={{
          searchText: '筛选',
          labelWidth: 'auto',
          collapsed: false,
        }}
        options={false}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
      />
    </div>
  );
}
