import {
  addSensitives,
  deleteSensitive,
  disableSensitive,
  enableSensitive,
  getSensitives,
  SensitiveItem,
  updateSensitive,
} from '@/services/sensitive';
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
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useRef } from 'react';
import SensitiveForm from './components/SensitiveForm';

const columns: ProColumns<SensitiveItem>[] = [
  {
    title: '屏蔽词',
    dataIndex: 'value',
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
    title: '添加时间',
    dataIndex: 'createTime',
    valueType: 'date',
    search: false,
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    hideInSearch: true,
    render: (text, record, _, action) => (
      <Tag
        color={record.enabled ? 'green' : 'red'}
        className="cursor-pointer"
        onClick={async () => {
          const res = record.enabled
            ? await enableSensitive(record.id)
            : await disableSensitive(record.id);
          if (res instanceof Error) {
            return;
          } else {
            message.success('删除成功');
            action?.reload();
          }
        }}
      >
        {record.enabled ? '启用' : '禁用'}
      </Tag>
    ),
  },

  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <SensitiveForm
        key="edit"
        id={record.id}
        title="编辑屏蔽词"
        onFinish={async (value) => {
          const res = await updateSensitive({
            id: record.id,
            value: value,
          });
          if (res instanceof Error) {
            return;
          } else {
            message.success('编辑成功');
            action?.reload();
          }
        }}
      ></SensitiveForm>,
      <Popconfirm
        key="delete"
        title="删除确认"
        description="您确定要删除此屏蔽词吗?"
        onConfirm={async () => {
          const res = await deleteSensitive(record.id);
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
}): Promise<Partial<RequestData<SensitiveItem>>> => {
  try {
    const res = await getSensitives(params);
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

const AccessPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      title="屏蔽词管理"
    >
      <ProTable<SensitiveItem>
        key="sensitive"
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          return getData({
            key: params.value ?? '',
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
        search={false}
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
            title="添加屏蔽词"
            width={456}
            layout="horizontal"
            trigger={
              <Button key="button" type="primary" icon={<PlusOutlined />}>
                添加敏感词
              </Button>
            }
            onFinish={async (values) => {
              addSensitives({ value: values.value }).then((res) => {
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
              name="value"
              rules={[{ required: true, message: '请输入名称' }]}
              label="屏蔽词"
              placeholder="请输入名称"
            />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default AccessPage;
