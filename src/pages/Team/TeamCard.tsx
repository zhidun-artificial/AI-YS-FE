import { Tag } from 'antd';
import { Icon } from 'umi';

export default function TeamCard() {
  const team = {
    id: 1,
    name: '团队1',
    desc: '团队1的描述',
    count: 10,
    members: [
      {
        name: '用户1',
        title: '数据分析师',
        isManager: true,
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      },
      {
        name: '用户2',
        title: '数据分析师',
        isManager: false,
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      },
      {
        name: '用户3',
        title: '数据分析师',
        isManager: false,
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      },
    ],
  };

  return (
    <section key={team.id} className="w-full bg-white p-6 rounded-xl">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-[#4F46E5] bg-opacity-10 rounded-xl flex justify-center items-center mr-4">
          <Icon icon="local:search" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-[#111827]">{team.name}</span>
          <span className=" font-normal text-sm text-[#6B7280]">
            {team.count}位成员
          </span>
        </div>
      </div>
      <div>
        {team.members.map((member) => (
          <div key={member.name} className="flex items-center mt-4">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2 flex flex-col flex-grow">
              <span className="font-bold text-base text-[#111827]">
                {member.name}
              </span>
              <span className="font-normal text-sm text-[#6B7280]">
                {member.title}
              </span>
            </div>
            {member.isManager ? (
              <Tag bordered={false} color="processing">
                管理员
              </Tag>
            ) : (
              <span>成员</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
