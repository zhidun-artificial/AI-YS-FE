import { Input, Segmented } from 'antd';
import { useState } from 'react';
import './index.css';

import { SearchOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select, Space } from 'antd';

const options: SelectProps['options'] = [];

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectChange = (value: string[]) => {
    setSelectedItems(value);
    handleChange(value);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <section className="tips-card p-8 flex flex-col items-center mt-20 w-[672px] mx-auto rounded-[20px]">
        <span className="tips-title mb-4">智能文献搜索</span>
        <p className="w-[512px] text-center text-[#4B5563] text-base font-normal">
          通过先进的语义分析技术，精准理解您的搜索意图，快速定位知识库中的相关文献，让您的办公和学习更加高效自由。
          <span className="text-[#4F46E5]">✨ 让知识触手可及</span>
        </p>
      </section>
      <section className="mt-8 mx-auto">
        <Segmented<string>
          options={['语意检索', '关键词检索']}
          size="large"
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </section>
      <section className="mt-8 mx-auto">
        <Space style={{ width: '100%' }} direction="horizontal">
          <Select
            mode="multiple"
            size="large"
            allowClear
            style={{ width: '192px' }}
            placeholder="请选择"
            value={selectedItems}
            onChange={handleSelectChange}
            options={options}
            maxTagCount={0}
            maxTagPlaceholder={() => `已选择 ${selectedItems.length} 个知识库`}
            tagRender={tagRender}
          />
          <Input
            className="w-[472px]"
            size="large"
            placeholder="请输入"
            prefix={<SearchOutlined />}
          />
        </Space>
      </section>
    </div>
  );
}
