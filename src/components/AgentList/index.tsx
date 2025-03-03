
import { Drawer } from 'antd';
import React from 'react';
import { AgenteItem } from '@/services/agent';
import { Icon } from 'umi';

interface AgentListProps {
  showAngets: boolean;
  setShowAngets: React.Dispatch<React.SetStateAction<boolean>>;
  agents: AgenteItem[];
  onClick: (item: any) => void;
}

const AgentList: React.FC<AgentListProps> = ({ agents, showAngets, setShowAngets, onClick }) => {

  return (
    <Drawer
      placement="left"
      mask={true}
      title="我的助理"
      getContainer={'#appContent'}
      rootStyle={{ position: 'absolute', zIndex: 40 }}
      styles={{
        content: { background: '#FFF' },
        mask: { background: 'rgba(0, 0, 0, 0.1)' },
      }}
      open={showAngets}
      onClose={() => setShowAngets(false)}
    >
      <div>
        {agents.map((item: AgenteItem) => (
          <div
            key={item.name}
            className={`hover:bg-[#F3F4F6] flex-row leading-[40px] pl-4 h-[40px] hover:cursor-pointer w-full rounded flex items-center my-[2px]`}
            onClick={() => onClick({
              ...item,
              type: 'agent'
            })}
          >
            <Icon
              icon={((item.ext as { icon: string }).icon || 'local:knowledge') as any}
              className="mr-[12px]"
            />
            <span className="text-[#4B5563] font-normal text-sm">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default AgentList;
