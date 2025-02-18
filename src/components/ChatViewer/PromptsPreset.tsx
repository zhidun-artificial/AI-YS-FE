import { ReactComponent as SvgAIAbstract } from '@/assets/svg/ai-abstract.svg';
import { ReactComponent as SvgDeepAbstract } from '@/assets/svg/deep-abstract.svg';
import { ReactComponent as SvgHotTopic } from '@/assets/svg/hot-topic.svg';
import { ReactComponent as SvgInterpret } from '@/assets/svg/interpret.svg';
import { ReactComponent as SvgSummary } from '@/assets/svg/summary.svg';
import Icon from '@ant-design/icons';
import { PromptProps, Prompts } from '@ant-design/x';
import { GetProp, Tooltip } from 'antd';

const senderPromptsItems: Array<PromptProps & { prompt: string }> = [
  {
    key: '1',
    description: (
      <Tooltip title="系统直接从文本中精准筛选、提取关键语句、重要概念、研究方法、主要结果及核心结论等信息，巧妙组合形成提取式智能摘要。此摘要准确性和客观性强，如实反映文本内容，避免主观偏差，保留关键数据、公式等细节，操作简便。特别适用于自然科学、工程技术等注重具体研究内容和成果的领域文本，助您快速获取原汁原味的核心内容。">
        <span>智能摘要-提取式</span>
      </Tooltip>
    ),
    prompt: '智能摘要-提取式',
    icon: (
      <Icon
        component={SvgAIAbstract}
        width={18}
        height={18}
        style={{ color: '#586A92' }}
      />
    ),
  },
  {
    key: '2',
    description: (
      <Tooltip title="系统深入剖析文本，在充分理解整体内容的基础上，对核心思想、主要观点、研究目的、方法、结果和结论进行高度概括提炼，以抽象简洁的方式生成智能摘要。它高度概括，舍弃具体细节，仅保留关键信息；重点突出观点和结论，凸显文本核心价值；具备引导性，激发您进一步探索文本详情的兴趣。适用于各类学术文本，尤其是哲学、社会学、文学理论等理论性强、内容复杂的文本。">
        <span>智能摘要-抽象式</span>
      </Tooltip>
    ),
    prompt: '智能摘要-抽象式',
    icon: (
      <Icon
        component={SvgDeepAbstract}
        width={18}
        height={18}
        style={{ color: '#586A92' }}
      />
    ),
  },
  {
    key: '3',
    description: (
      <Tooltip title="系统全面收集并深度分析相关资料，梳理其中逻辑关系，从多角度对主题进行归纳整合，生成全面且有条理的智能综述。它将零散信息系统化，展现主题全貌，无论是学术研究还是了解行业动态，都能助您快速把握关键，掌握全局。">
        <span>智能综述</span>
      </Tooltip>
    ),
    prompt: '智能综述',
    icon: (
      <Icon
        component={SvgSummary}
        width={18}
        height={18}
        style={{ color: '#586A92' }}
      />
    ),
  },
  {
    key: '4',
    description: (
      <Tooltip title="一键获取当前学科领域内最受关注的研究话题、前沿理论以及最新研究成果等热点信息。追踪学科热点，助您紧跟学科发展趋势，了解最新学术动态，为您的研究和学习提供方向指引，把握学科发展的脉搏。">
        <span>学科热点</span>
      </Tooltip>
    ),
    prompt: '学科热点',
    icon: (
      <Icon
        component={SvgHotTopic}
        width={18}
        height={18}
        style={{ color: '#586A92' }}
      />
    ),
  },
  {
    key: '5',
    description: (
      <Tooltip title="借助先进翻译技术，快速将外文文献精准翻译为中文，帮您攻克语言难关，深入挖掘国际学术前沿成果，助力学术研究与知识汲取。">
        <span>智能翻译</span>
      </Tooltip>
    ),
    prompt: '智能翻译',
    icon: (
      <Icon
        component={SvgInterpret}
        width={18}
        height={18}
        style={{ color: '#586A92' }}
      />
    ),
  },
];

export interface PromptsPresetProps {
  onSelectPrompt: GetProp<typeof Prompts, 'onItemClick'>;
}

const PromptsPreset: React.FC<PromptsPresetProps> = ({ onSelectPrompt }) => {
  return (
    <Prompts
      items={senderPromptsItems}
      styles={{
        item: {
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px 8px 8px 8px',
          border: '1px solid #DDE1E9',
        },
        itemContent: { color: '#586A92' },
      }}
      onItemClick={onSelectPrompt}
    />
  );
};

export default PromptsPreset;
