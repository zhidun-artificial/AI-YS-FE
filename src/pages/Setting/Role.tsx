import { httpPost } from '@/services/http';
import {
  deleteRole,
  getRoles,
  RoleItem,
  updateRole,
} from '@/services/user/role';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  RequestData,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import AuthModal from './components/AuthModal';
import RoleForm from './components/RoleForm';

const columns: ProColumns<RoleItem>[] = [
  {
    title: '角色名称',
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
    title: '备注',
    dataIndex: 'remarks',
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
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <RoleForm
        key="edit"
        title=""
        id={record.id}
        onFinish={async ({ name, remarks }) => {
          const res = await updateRole({ id: record.id, name, remarks });
          if (res instanceof Error) {
            return;
          } else {
            message.success('修改成功');
            action?.reload();
          }
        }}
      />,
      <AuthModal key="auth" record={record} />,
      <Popconfirm
        key="delete"
        title="删除确认"
        description="您确定要删除此角色吗?"
        onConfirm={async () => {
          const res = await deleteRole(record.id);
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
}): Promise<Partial<RequestData<RoleItem>>> => {
  try {
    const res = await getRoles(params);
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
      title="角色管理"
    >
      <ProTable<RoleItem>
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
            title="添加角色"
            width={456}
            layout="horizontal"
            trigger={
              <Button key="button" icon={<PlusOutlined />}>
                新建
              </Button>
            }
            onFinish={async (values) => {
              httpPost<any, { code: number; msg: string; data: any }>(
                '/api/v1/roles',
                values,
              ).then((res) => {
                if (res instanceof Error) {
                } else if (res.code === 0) {
                  message.success('添加成功');
                  actionRef.current?.reload();
                }
              });
              return true;
            }}
          >
            <ProFormText
              width="md"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
              label="角色名称"
              placeholder="请输入名称"
            />

            <ProFormTextArea
              fieldProps={{ rows: 6 }}
              width="md"
              name="remarks"
              label="备注"
              placeholder="请输入"
            />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};
