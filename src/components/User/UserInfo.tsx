interface UserInfoProps {
  avatar: string;
  name: string;
  title: string;
}

export default function UserInfo({ avatar, name, title }: UserInfoProps) {
  return (
    <>
      <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
      <div className="ml-2 flex flex-col flex-grow">
        <span className="font-bold text-base text-[#111827]">{name}</span>
        <span className="font-normal text-sm text-[#6B7280]">{title}</span>
      </div>
    </>
  );
}
