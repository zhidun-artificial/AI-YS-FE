import UserInfo from '@/components/User/UserInfo';
import { deleteTeam, IGroupItem } from '@/services/team';
import { message, Tag } from 'antd';
import { Icon } from 'umi';

export default function TeamCard({
  team,
  reload,
}: {
  team: IGroupItem;
  reload: () => void;
}) {
  const handleDelete = async (id: string) => {
    const res = await deleteTeam({ groupId: team.id, userId: id });
    if (res instanceof Error) {
      message.error(res.message);
    } else {
      message.success('删除成功');
      reload();
    }
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
            {team.userCount}位成员
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-4">
        {team.users.map((user) => (
          <div
            key={user.name}
            className="flex items-center hover:bg-[#F9FAFB] p-3 rounded-xl !mr-0"
          >
            <UserInfo
              avatar={user.avatar}
              name={user.name}
              title={user.title}
            />
            {user.permit ? (
              <Tag bordered={false} color="processing">
                管理员
              </Tag>
            ) : (
              <span className="text-[#6B7280] font-normal text-xs block mr-2">
                成员
              </span>
            )}
            {!user.permit && (
              <Icon
                icon="local:deleteGray"
                className="cursor-pointer"
                onClick={() => handleDelete(user.id)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
