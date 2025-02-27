import { CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Segmented,
  Select,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import './index.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

const options: SelectProps['options'] = [];

interface DataType {
  key: string;
  name: string;
  description: string;
  uploadDate: string;
  uploader: string;
}

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
  const [isSearching, setIsSearching] = useState(true);
  const [fileType, setFileType] = useState<string>('全部');
  const [uploader, setUploader] = useState<string>('所有人');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('2024-01-01'),
    dayjs('2024-01-15'),
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [jumpToPage, setJumpToPage] = useState<string>('');

  const data: DataType[] = [
    {
      key: '1',
      name: '《人工智能技术在公安实战中的应用研究》',
      description:
        '本文深入分析人工智能技术在公安实战中的具体应用，包括人脸识别、视频分析、智能预警等关键技术，并探讨其在实际案件中的效果...',
      uploadDate: '2024-01-15',
      uploader: '陈明宇',
    },
    {
      key: '2',
      name: '《基于深度学习的警务大数据分析系统设计与实现》',
      description:
        '该研究提出一种基于深度学习的警务大数据分析框架，通过多维数据融合和智能算法，实现犯罪预测和警力部署优化...',
      uploadDate: '2024-01-14',
      uploader: '林晓华',
    },
    {
      key: '3',
      name: '《智慧公安建设中的人工智能关键技术研究》',
      description:
        '文章系统总结了智慧公安建设中的AI关键技术，包括机器视觉、语音识别、自然语言处理等，并分析其在实战中的应用价值...',
      uploadDate: '2024-01-13',
      uploader: '王建军',
    },
    {
      key: '4',
      name: '《公安机关人工智能技术应用现状与展望》',
      description:
        '对当前公安机关在人工智能领域的应用现状进行调研，分析存在的问题和挑战，并对未来发展趋势进行展望...',
      uploadDate: '2024-01-12',
      uploader: '赵明阳',
    },
    {
      key: '5',
      name: '《AI 驱动的警务信息化建设研究报告》',
      description:
        '研究报告详细分析了AI技术在警务信息化建设中的应用场景，并提出了具体的实施策略和建设路径...',
      uploadDate: '2024-01-11',
      uploader: '杨文博',
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: '文献名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Link>{text}</Link>
          <p style={{ margin: 0 }}>{record.description}</p>
        </div>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          上传日期 <CalendarOutlined style={{ marginLeft: 4 }} />
        </div>
      ),
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      align: 'center',
      width: 150,
    },
    {
      title: '上传人',
      dataIndex: 'uploader',
      key: 'uploader',
      align: 'center',
      width: 150,
    },
  ];

  const handleFilter = () => {
    console.log('Filtering with:', {
      fileType,
      uploader,
      dateRange: dateRange.map((date) => date.format('YYYY-MM-DD')),
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleJumpToPage = () => {
    const page = Number.parseInt(jumpToPage);
    if (!isNaN(page) && page > 0 && page <= Math.ceil(126 / pageSize)) {
      setCurrentPage(page);
    }
  };

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
      </section>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '4px',
        }}
      >
        <div className="flex flex-row gap-4 mb-5">
          <div>
            <span>文件类型:</span>
            <Select
              value={fileType}
              style={{ width: 150 }}
              onChange={setFileType}
              suffixIcon={<SearchOutlined />}
            >
              <Option value="全部">全部</Option>
              <Option value="文档">文档</Option>
              <Option value="图片">图片</Option>
              <Option value="视频">视频</Option>
            </Select>
          </div>

          <div>
            <span>上传人:</span>
            <Select
              value={uploader}
              style={{ width: 150 }}
              onChange={setUploader}
              suffixIcon={<SearchOutlined />}
            >
              <Option value="所有人">所有人</Option>
              <Option value="陈明宇">陈明宇</Option>
              <Option value="林晓华">林晓华</Option>
              <Option value="王建军">王建军</Option>
            </Select>
          </div>

          <div>
            <span>上传时间:</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) =>
                dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
              }
            />
          </div>

          <Button type="primary" onClick={handleFilter}>
            筛选
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={() => 'expandable-row'}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            alignItems: 'center',
          }}
        >
          <span>
            共 126 条数据 | 每页显示
            <Select
              value={pageSize.toString()}
              style={{ margin: '0 8px', width: '60px' }}
              onChange={(value) =>
                handlePageSizeChange(currentPage, Number.parseInt(value))
              }
            >
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
            </Select>
            条
          </span>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={126}
              onChange={handlePageChange}
              showQuickJumper={false}
              showSizeChanger={false}
            />

            <span style={{ marginLeft: '20px' }}>
              跳转
              <Input
                style={{ width: '50px', margin: '0 8px' }}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
              />
              <Button type="primary" onClick={handleJumpToPage}>
                跳转
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
