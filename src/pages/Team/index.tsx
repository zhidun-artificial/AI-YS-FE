import { addUser, getTeams, getTreeData, IGroupItem } from '@/services/team';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, message, Select, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateTeam from './CreateTeam';
import TeamCard from './TeamCard';

export type TreeDataType = {
  title: string;
  value: string;
  children: { title: string; value: string }[];
};

export type IInitFormData = {
  name?: string;
  adminId?: string;
  description?: string;
  theme?: string;
  icon?: string;
};

export default function Search() {
  const [teams, setTeams] = useState<IGroupItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined,
  );
  const [treeData, setTreeData] = useState<TreeDataType[]>([]);
  const [value, setValue] = React.useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<IInitFormData>({});

  const onChange = (newValue: string[]) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchTreeData = async () => {
      const res = await getTreeData();
      if (res instanceof Error) {
        message.error(res.message);
      } else {
        const resTreeData = res.data.map((item) => {
          return {
            title: item.organName,
            value: `F-${item.id.toString()}`,
            children: item.personArray?.map((child) => {
              return {
                title: child.name,
                value: child.id.toString(),
              };
            }),
          };
        });
        setTreeData(resTreeData);
      }
    };
    fetchTreeData();
  }, []);

  const searchTeams = async () => {
    const res = await getTeams({
      sort: 'CREATED_AT_DESC',
      withUsers: true,
      pageNo: 1,
      pageSize: 99999,
    });
    if (res instanceof Error) {
      message.error(res.message);
    } else {
      setTeams(res.data.records);
      if (res.data.records.length > 0) {
        setSelectedTeam(res.data.records[0].id.toString());
      }
    }
  };

  useEffect(() => {
    searchTeams();
  }, []);

  const handlerAddMember = async () => {
    const res = await addUser({
      groupId: selectedTeam as string,
      userId: value.join(','),
    });
    if (res instanceof Error) {
      message.error(res.message);
    } else {
      message.success('添加成功');
      searchTeams();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <section className="w-full bg-white px-6 py-7 rounded-xl mb-4">
        <div className="flex justify-between items-center mb-4">
          <span>添加成员</span>
          <div className="flex">
            {/* 下拉筛选框 */}
            <Select
              style={{ width: 200, marginRight: 16 }}
              value={selectedTeam}
              onChange={(value) => setSelectedTeam(value)}
            >
              {teams.map((team) => (
                <Select.Option key={team.id} value={team.id}>
                  {team.name}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<UsergroupAddOutlined />}
              onClick={handlerAddMember}
            >
              添加
            </Button>
            <Button
              icon={<PlusOutlined />}
              className="ml-3"
              onClick={() => {
                setVisible(true);
                setInitialValues({});
              }}
            >
              新建团队
            </Button>
            {visible && (
              <CreateTeam
                key={`${visible}`}
                update={() => searchTeams()}
                treeData={treeData}
                visible={visible}
                initialValues={initialValues}
                setVisible={setVisible}
              />
            )}
          </div>
        </div>
        <TreeSelect
          treeData={treeData}
          value={value}
          onChange={onChange}
          multiple
          style={{ width: '100%' }}
          treeCheckable
          treeDefaultExpandAll
          placeholder="搜索用户"
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          dropdownStyle={{ maxHeight: 500, overflow: 'auto' }} // 设置下拉框的最大高度和滚动条
          showSearch
          treeNodeFilterProp="title" // 设置过滤属性为 title
        />
      </section>
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => {
          return (
            <TeamCard
              key={team.id}
              team={team}
              reload={searchTeams}
              editTeam={(team) => {
                setVisible(true);
                setInitialValues({
                  name: team.name,
                  description: team.description,
                  theme: team.ext.theme,
                  icon: team.ext.icon,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
