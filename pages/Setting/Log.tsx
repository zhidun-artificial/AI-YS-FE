import { getLogs, LogItem } from '@/services/chat/log';
import type {
  ActionType,
  ProColumns,
  RequestData,
} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';

const getData = async (params: {
  pageNo: number;
  pageSize: number;
}): Promise<Partial<RequestData<LogItem>>> => {
  try {
    const res = await getLogs(params);
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

const Log: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<LogItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      search: false,
    },
    // {
    //   title: '会话ID',
    //   dataIndex: 'conversationId',
    //   search: false,
    // },
    {
      title: '名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '创建者',
      dataIndex: 'creatorName',
      search: false,
    },
    {
      title: '数量',
      dataIndex: 'count',
      search: false,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'date',
      search: false,
    },
  ];

  return (
    <PageContainer
      style={{ height: '100%', overflow: 'auto' }}
      title="审计日志"
    >
      <ProTable<LogItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          return getData({
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
        toolBarRender={() => []}
      />
    </PageContainer>
  );
};

export default Log;
