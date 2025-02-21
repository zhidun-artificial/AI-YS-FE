import {
  addSensitives,
  deleteSensitive,
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
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import SensitiveForm from './components/SensitiveForm';

const columns: ProColumns<SensitiveItem>[] = [
  {
    title: '屏蔽词',
    dataIndex: 'blockedWord',
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
  // {
  //   title: '创建时间',
  //   key: 'showTime',
  //   dataIndex: 'createTime',
  //   valueType: 'date',
  //   sorter: true,
  //   hideInSearch: true,
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <SensitiveForm
        key="edit"
        id={record.id}
        title="编辑屏蔽词"
        onFinish={async (blockedWord) => {
          const res = await updateSensitive({ id: record.id, blockedWord });
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
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          return getData({
            key: params.blockedWord ?? '',
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
            title="添加屏蔽词"
            width={456}
            layout="horizontal"
            trigger={
              <Button key="button" type="primary" icon={<PlusOutlined />}>
                添加敏感词
              </Button>
            }
            onFinish={async (values) => {
              addSensitives({ blockedWord: values.blockedWord }).then((res) => {
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
              name="blockedWord"
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
