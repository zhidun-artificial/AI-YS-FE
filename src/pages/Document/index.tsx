// import FileModal from '@/components/FileModal';
import ShowMoreSVG from '@/assets/icons/show-more.svg';
import PdfPng from '@/assets/images/pdf.png';
import WordPng from '@/assets/images/word.png';
import { DocFileInfo } from '@/services/chat/chatConversation';
import { DocItem, searchDocuments } from '@/services/documents/searchDocuments';
import { searchLibraries } from '@/services/libraries/searchLibraries';
import {
  DownloadOutlined,
  FileAddOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Checkbox, Dropdown, Input, MenuProps, Select } from 'antd';
import type { Key } from 'react';
import React, { useEffect } from 'react';

import './index.css';
const { Search } = Input;

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '智能问答',
    icon: <QuestionCircleOutlined />,
  },
  {
    key: '2',
    label: '选择多篇',
    icon: <FileAddOutlined />,
  },
  {
    key: '3',
    label: '下载',
    icon: <DownloadOutlined />,
  },
];

const AccessPage: React.FC = () => {
  const [options, setOptions] = React.useState<any>([]);
  const [selected, setSelected] = React.useState<any>('');
  const [docList, setDocList] = React.useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');

  useEffect(() => {
    const update = async () => {
      const res = await searchLibraries({ key: '', pageNo: 1, pageSize: 100 });
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        setOptions(
          res.data.records.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
        setSelected(res.data.records[0]?.id);
      }
    };
    update();
  }, []);

  const fetchDocument = async () => {
    const res = await searchDocuments({
      key: searchValue,
      libraryId: selected,
      pageNo: 1,
      pageSize: 999,
    });
    if (res instanceof Error) {
      return;
    }
    if (res.code === 0) {
      setDocList(res.data.records);
    }
  };

  useEffect(() => {
    setSearchValue('');
  }, [selected]);

  useEffect(() => {
    if (selected) fetchDocument();
  }, [selected, searchValue]);

  const handleChange = (value: string) => {
    setSelected(value);
  };

  const goChat = (ids: Key[]) => {
    const list: DocFileInfo = docList.filter((item: any) =>
      ids.includes(item.id),
    );
    console.log(list);
    history.push(`/new/${Date.now()}`, { docFiles: list });
  };

  const handleMenuClick = (menu: any, item: DocItem) => {
    const { key } = menu;
    if (key === '1') {
      goChat([item.id]);
    } else if (key === '2') {
      setSelectedRowKeys((prev) => {
        if (prev.includes(item.id)) {
          return [...prev];
        }
        return [...prev, item.id];
      });
    } else if (key === '3') {
      // js实现下载功能item.url
      console.log('下载');
      const link = document.createElement('a'); //创建a标签
      link.download = item.fileName; //a标签添加属性
      link.style.display = 'none';
      link.href = item.rawUrl;
      document.body.appendChild(link);
      link.click(); //执行下载
      URL.revokeObjectURL(link.href); //释放url
      document.body.removeChild(link); //释放标签
    }
  };

  return (
    <PageContainer style={{ height: '100%', overflow: 'auto' }}>
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex gap-[20px]">
          <Select
            value={selected}
            style={{ width: 200 }}
            onChange={handleChange}
            options={options}
          />
          <Search
            placeholder="请输入文档名称"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={fetchDocument}
            onSearch={fetchDocument}
            allowClear={true}
            enterButton="搜索"
            style={{ width: 300 }}
          />
        </div>
        {/* <FileModal /> */}
        {selectedRowKeys.length > 0 && (
          <Button type="primary" onClick={() => goChat(selectedRowKeys)}>
            确认问答
          </Button>
        )}
      </div>
      <section className="flex flex-wrap gap-[20px]">
        {docList.map((item: DocItem) => (
          <div
            key={item.id}
            className="w-[200px] flex flex-col items-center justify-center]"
          >
            <div
              className={`${
                selectedRowKeys.includes(item.id) ? 'border-blue-500' : ''
              } w-full h-[280px] bg-white rounded-[12px] hover:cursor-pointer relative flex justify-center items-center flex-shrink-0`}
              onClick={() => {
                setSelectedRowKeys((prev) => {
                  if (prev.includes(item.id)) {
                    return prev.filter((i) => i !== item.id);
                  }
                  return [...prev, item.id];
                });
              }}
            >
              <img
                src={
                  item.coverUrl
                    ? item.coverUrl
                    : item.fileName.includes('.pdf')
                    ? PdfPng
                    : WordPng
                }
                alt=""
                className={
                  item.coverUrl ? 'w-full h-full' : 'w-[80px] h-[80px]'
                }
              />
              {selectedRowKeys.length > 0 && (
                <Checkbox
                  checked={selectedRowKeys.includes(item.id)}
                  className="absolute top-2 right-2"
                />
              )}
            </div>
            <p className="flex justify-between w-full mt-1">
              <span className="w-[178px] truncate">{item.title}</span>
              <Dropdown
                menu={{
                  items,
                  onClick: (menuItem) => handleMenuClick(menuItem, item),
                }}
              >
                <img
                  src={ShowMoreSVG}
                  alt=""
                  className="h-[6px] mt-3 hover:cursor-pointer"
                />
              </Dropdown>
            </p>
          </div>
        ))}
      </section>
    </PageContainer>
  );
};

export default AccessPage;
