import { registerUser } from '@/services/auth/register';
import { getRoles } from '@/services/user/role';
import {
  deleteUser,
  getUsers,
  updateRole,
  UserItem,
} from '@/services/user/user';
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
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';

const getData = async (params: {
  key: string;
  pageNo: number;
  pageSize: number;
}): Promise<Partial<RequestData<UserItem>>> => {
  try {
    const res = await getUsers(params);
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

const UserControl: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<number>();
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [roleMap, setRoleMap] = useState<{ [key: string]: string }>({});
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户名称',
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
      title: '角色',
      dataIndex: 'roleId',
      search: false,
      render: (text, record) => <span>{roleMap[`${record.roleId}`]}</span>,
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
        <Button
          type="link"
          onClick={() => {
            setEditingUser(record.id);
            setIsModalOpen(true);
          }}
          key="user"
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="删除确认"
          description="您确定要删除此用户吗?"
          onConfirm={async () => {
            const res = await deleteUser(record.id);
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

  useEffect(() => {
    getRoles({ key: '', pageNo: 1, pageSize: 9999 }).then((res) => {
      if (res instanceof Error) {
        throw res;
      } else {
        const map: { [x: string]: string } = {};
        const options = res.data.records.map((item) => {
          map[item.id] = item.name;
          return {
            value: item.id,
            label: item.name,
          };
        });
        setRoleMap(map);
        setRoleOptions(options);
      }
    });
  }, []);

  return (
    <PageContainer
      style={{ height: '100%', overflow: 'auto' }}
      title="用户管理"
    >
      <ProTable<UserItem>
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
            title="添加用户"
            width={456}
            layout="horizontal"
            trigger={
              <Button key="button" icon={<PlusOutlined />}>
                新建
              </Button>
            }
            onFinish={async (values) => {
              const res = await registerUser(
                values as { username: string; password: string },
              );
              if (res instanceof Error) {
                return;
              }
              if (res.code === 0) {
                message.success('创建用户成功');
                actionRef.current?.reload();
              }
              return true;
            }}
          >
            <ProFormText
              width="md"
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
              label="用户名"
              placeholder="请输入用户名"
            />
            <ProFormText
              width="md"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
              label="密码"
              placeholder="请输入密码"
            />
          </ModalForm>,
        ]}
      />
      <Modal
        title="编辑用户"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <ProForm
          onFinish={async (values) => {
            const res = await updateRole({
              id: editingUser,
              role: values.role,
            });
            if (res instanceof Error) {
              throw res;
            } else {
              message.success('提交成功');
              setIsModalOpen(false);
              actionRef.current?.reload();
            }
          }}
        >
          <ProFormSelect
            options={roleOptions}
            width="sm"
            name="role"
            label="用户角色"
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default UserControl;
