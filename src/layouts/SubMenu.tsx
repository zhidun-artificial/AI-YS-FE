import { Icon } from 'umi';

export default function SubMenu({
  items,
  onClick,
}: {
  items: any[];
  onClick: (item: any) => void;
}) {
  return (
    <div className="py-[2px] w-full pl-4">
      {items.map((item) => (
        <div
          key={item.name}
          className={`hover:bg-[#F3F4F6] flex-row leading-[40px] pl-4 h-[40px] hover:cursor-pointer w-full rounded flex items-center my-[2px]`}
          onClick={() => onClick(item)}
        >
          <Icon
            icon={(item.icon || 'local:knowledge') as any}
            className="mr-[12px]"
          />
          <span className="text-[#4B5563] font-normal text-sm">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
