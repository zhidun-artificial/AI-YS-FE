import { PageContainer, StatisticCard } from '@ant-design/pro-components';
const { Statistic } = StatisticCard;

// mock数据
const gpuData = {
  usage: 65, // GPU使用率
  memoryUsage: 45, // 显存使用率
  temperature: 72, // GPU温度
  fanSpeed: 1800 // 风扇转速
};

const memoryData = {
  total: 32, // 总内存(GB)
  used: 12, // 已使用内存(GB)
  free: 20, // 可用内存(GB)
  usage: 37.5 // 内存使用率
};

const diskData = {
  total: 1024, // 总容量(GB)
  used: 512, // 已使用容量(GB)
  free: 512, // 可用容量(GB)
  usage: 50, // 磁盘使用率
  iops: 1200, // IOPS
  speed: '120MB/s' // 磁盘读写速度
};

const Resource = () => {
  return (
    <PageContainer
      style={{
        height: '100%',
        overflow: 'auto',
        background: 'white',
        borderRadius: '12px',
      }}
      ghost
      header={{
        title: '资源统计',
      }}
    >
      {/* 显卡分类 */}
      <StatisticCard 
        title="显卡" 
        style={{ 
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
        }}
      >
        <StatisticCard.Group>
          <StatisticCard>
            <Statistic title="GPU使用率" value={`${gpuData.usage}%`} trend="up" />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="显存使用率" value={`${gpuData.memoryUsage}%`} trend="down" />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="GPU温度" value={`${gpuData.temperature}°C`} trend="up" />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="风扇转速" value={`${gpuData.fanSpeed}RPM`} trend="down" />
          </StatisticCard>
        </StatisticCard.Group>
      </StatisticCard>

      {/* 内存分类 */}
      <StatisticCard 
        title="内存" 
        style={{ 
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
        }}
      >
        <StatisticCard.Group>
          <StatisticCard>
            <Statistic title="总内存" value={`${memoryData.total}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="已使用内存" value={`${memoryData.used}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="可用内存" value={`${memoryData.free}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="内存使用率" value={`${memoryData.usage}%`} />
          </StatisticCard>
        </StatisticCard.Group>
      </StatisticCard>

      {/* 硬盘分类 */}
      <StatisticCard 
        title="硬盘" 
        style={{ 
          borderRadius: 8,
          boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
        }}
      >
        <StatisticCard.Group>
          <StatisticCard>
            <Statistic title="总容量" value={`${diskData.total}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="已使用容量" value={`${diskData.used}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="可用容量" value={`${diskData.free}GB`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="磁盘使用率" value={`${diskData.usage}%`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="IOPS" value={`${diskData.iops}`} />
          </StatisticCard>
          <StatisticCard>
            <Statistic title="磁盘读写速度" value={`${diskData.speed}`} />
          </StatisticCard>
        </StatisticCard.Group>
      </StatisticCard>
    </PageContainer>
  );
};

export default Resource;
