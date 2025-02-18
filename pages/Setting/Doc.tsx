import { createLibrary, LibraryItem } from '@/services/libraries/createLibrary';
import {
  deleteLibrarie,
  searchLibraries,
} from '@/services/libraries/searchLibraries';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  RequestData,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import UpdateLibrary from './components/UpdateLibrary';

const columns: ProColumns<LibraryItem>[] = [
  {
    title: '专题库名称',
    dataIndex: 'name',
    ellipsis: true,
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
    title: '创建人',
    dataIndex: 'creatorName',
    search: false,
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'createTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '更新时间',
    key: 'showTime',
    dataIndex: 'updateTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <Link key="detail" to={`/setting/doc/${record.id}?name=${record.name}`}>
        <Button color="primary" variant="link">
          详情
        </Button>
      </Link>,
      <UpdateLibrary
        key="update"
        libraryId={record.id as number}
        oldName={record.name}
        updateOptions={() => action?.reload()}
      />,
      <Popconfirm
        key="delete"
        title="删除确认"
        description="您确定要删除此文库吗?"
        onConfirm={async () => {
          const res = await deleteLibrarie(record.id as number);
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
        <Button color="danger" variant="link">
          删除
        </Button>
      </Popconfirm>,
    ],
  },
];

const getData = async (params: {
  key: string;
  pageNo: number;
  pageSize: number;
}): Promise<Partial<RequestData<LibraryItem>>> => {
  try {
    const res = await searchLibraries(params);
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

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <PageContainer
      style={{ height: '100%', overflow: 'auto' }}
      title="文库管理"
    >
      <ProTable<LibraryItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          return getData({
            key: params.name,
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
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle=""
        toolBarRender={() => [
          <ModalForm
            key={1}
            {...{
              labelCol: { span: 5 },
              wrapperCol: { span: 18 },
            }}
            title="新建专题库"
            width={456}
            layout="horizontal"
            trigger={
              <Button key="button" icon={<PlusOutlined />}>
                新建
              </Button>
            }
            onFinish={async (values) => {
              const res = await createLibrary({ name: values.name });
              if (res instanceof Error) {
                return false;
              }
              if (res.code === 0) {
                message.success('提交成功');
                actionRef.current?.reload();
                return true;
              }
            }}
          >
            <ProForm.Group>
              <ProFormText
                width="md"
                name="name"
                required
                rules={[{ required: true, message: '请输入名称' }]}
                label="专题库"
                tooltip="最长为 24 位"
                placeholder="请输入名称"
              />
            </ProForm.Group>
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};
