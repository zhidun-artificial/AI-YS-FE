
import { Drawer } from 'antd';
import React from 'react';
import { AgenteItem } from '@/services/agent';

interface AgentListProps {
  showAngets: boolean;
  setShowAngets: React.Dispatch<React.SetStateAction<boolean>>;
  agents: AgenteItem[];
}

const AgentList: React.FC<AgentListProps> = ({ agents, showAngets, setShowAngets }) => {







  return (
    <Drawer
      placement="left"
      mask={true}
      title="历史会话"
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
        {
          agents.map(item => (
            <div className='flex flex-col' key={item.id}>
              <div>{item.name}</div>
            </div>
          ))
        }
      </div>
    </Drawer>
  );
};

export default AgentList;
