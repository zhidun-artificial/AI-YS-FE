import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import CreateTeam from './CreateTeam';
import TeamCard from './TeamCard';

export default function Search() {
  return (
    <div className="w-full flex flex-col">
      <section className="w-full bg-white px-6 py-7 rounded-xl mb-4">
        <div className="flex justify-between items-center mb-4">
          <span>添加成员</span>
          <div className="flex">
            <Button type="primary" icon={<UsergroupAddOutlined />}>
              批量添加
            </Button>
            <CreateTeam />
          </div>
        </div>
        <Input
          placeholder="搜索用户"
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        />
      </section>
      <div className="grid grid-cols-2 gap-4">
        <TeamCard />
        <TeamCard />
        <TeamCard />
      </div>
    </div>
  );
}
