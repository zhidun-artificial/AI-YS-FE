import LocalFile from '@/components/FileModal/localFile';
import {
  deleteDocument,
  DocItem,
  searchDocuments,
} from '@/services/documents/searchDocuments';
import { FileAddOutlined, LeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link, useMatch, useSearchParams } from '@umijs/max';
import type { TableColumnsType } from 'antd';
import { Button, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import RenameDocument from './components/RenameDocument';

const DocDetail: React.FC<unknown> = () => {
  const match = useMatch('/setting/doc/:DocDetail');
  const [searchParams] = useSearchParams();
  const libraryName = searchParams.get('name');

  const [form] = Form.useForm();
  const [data, setData] = useState<DocItem[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<any>([]);

  const fetchData = async () => {
    const res = await searchDocuments({
      key: form.getFieldValue('name'),
      libraryId: match?.params.DocDetail as unknown as number,
      pageNo: current,
      pageSize: pageSize,
    });
    if (res instanceof Error) {
      return;
    }
    if (res.code === 0) {
      setTotal(res.data.total);
      setData(res.data.records);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageSize, current]);

  const confirm = async (
    e: React.MouseEvent<HTMLButtonElement> | undefined,
    id: number,
  ) => {
    const res = await deleteDocument(id);
    if (res instanceof Error) {
      return;
    } else {
      message.success('删除成功');
      fetchData();
    }
  };

  const columns: TableColumnsType<DocItem> = [
    {
      title: '文档名称',
      dataIndex: 'title',
    },
    {
      title: '专题库',
      dataIndex: 'nickName',
      render: () => {
        return <span>{libraryName}</span>;
      },
    },
    {
      title: '发布人',
      dataIndex: 'creatorName',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render: (text, record) => {
        return <span>{new Date(record.createTime).toLocaleString()}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => (
        <>
          <RenameDocument
            DocId={record.id}
            oldName={record.title}
            update={fetchData}
          />
          <Popconfirm
            title="删除确认"
            description="您确定要删除此文件吗?"
            onConfirm={() => confirm(undefined, record.id)}
            okText="是"
            cancelText="否"
          >
            <Button color="danger" variant="link">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      style={{ height: '100%', overflow: 'auto' }}
      title={
        <>
          <Link to={`/setting/doc`}>
            <LeftOutlined />
            专题库详情
          </Link>
        </>
      }
    >
      <div className="bg-white p-6 rounded-lg mb-4">
        <Form
          layout={'inline'}
          form={form}
          initialValues={{ layout: 'inline' }}
          className="flex flex-wrap"
        >
          <Form.Item label="关键字：" name="name">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <div className="flex-1"></div>
          <Form.Item>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={fetchData}>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              color="primary"
              variant="outlined"
              icon={<FileAddOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              批量导入
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table<DocItem>
        // rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={data}
        pagination={{
          total: total,
          pageSize: pageSize,
          current: current,
          showTotal: (total, range) =>
            `第${range[0]}-${range[1]} 条/总共${total} 条`,
          onChange: (page, pageSize) => {
            setCurrent(page);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        width={940}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFiles([]);
          fetchData();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsModalOpen(false);
              setFiles([]);
              fetchData();
            }}
          >
            确定
          </Button>,
        ]}
        destroyOnClose
      >
        <LocalFile
          files={files}
          actionPath="/api/v1/documents/upload"
          libraryId={match?.params.DocDetail as unknown as string}
          setFiles={setFiles}
        />
      </Modal>
    </PageContainer>
  );
};

export default DocDetail;
