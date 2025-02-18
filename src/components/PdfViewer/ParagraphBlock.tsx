import { ReactComponent as SvgInterpret } from '@/assets/svg/interpret.svg';
import { copyTextToClipboard } from '@/utils/clipboard';
import Icon, { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React from 'react';

export interface ParagraphBlockProps {
  id: string;
  style: React.CSSProperties;
  originalContent: string;
  highlighted: boolean;
  onBlockAction?: (
    action: BlockAction,
    params: { paragraphId: string; content: string },
  ) => void;
}

type BlockAction = 'interpret' | 'translate' | 'copy';

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({
  id,
  style,
  originalContent,
  onBlockAction,
  highlighted = false,
}) => {
  const onClickInterpret = () => {
    if (onBlockAction)
      onBlockAction('interpret', { paragraphId: id, content: originalContent });
  };

  const onClickTranslate = () => {
    if (onBlockAction)
      onBlockAction('translate', { paragraphId: id, content: originalContent });
  };

  const onClickCopy = async () => {
    await copyTextToClipboard(originalContent);
    if (onBlockAction)
      onBlockAction('copy', { paragraphId: id, content: originalContent });
  };

  return (
    <div
      className={`paragraph-mask absolute bg-[#BFCCEB80] ${
        highlighted ? 'opacity-100' : 'opacity-0'
      }`}
      data-para-id={id}
      style={{
        ...style,
      }}
    >
      {highlighted && (
        <div
          className="paragraph-mask h-10 min-w-[240px] flex justify-around items-center absolute right-0 top-full px-4 border border-solid border-[#DDE1E9] bg-white text-[#000614] rounded-lg z-10"
          data-para-id={id}
        >
          <span
            className="cursor-pointer text-sm hover:bg-[#DDE1E9] p-1"
            onClick={onClickInterpret}
          >
            <InfoCircleOutlined
              height={18}
              width={18}
              color="#586a92"
              className="mr-1"
            ></InfoCircleOutlined>
            <span className="cursor-pointer hover:bg-[#DDE1E9]">解释</span>
          </span>
          <Divider type="vertical"></Divider>
          <span
            className="cursor-pointer text-sm hover:bg-[#DDE1E9] p-1"
            onClick={onClickTranslate}
          >
            <Icon
              color="#586a92"
              height={18}
              width={18}
              component={SvgInterpret}
              className="mr-1"
            ></Icon>
            翻译
          </span>
          <Divider type="vertical"></Divider>
          <span
            className="cursor-pointer text-sm hover:bg-[#DDE1E9] p-1"
            onClick={onClickCopy}
          >
            <CopyOutlined
              height={18}
              width={18}
              color="#586a92"
              className="mr-1"
            ></CopyOutlined>
            复制
          </span>
        </div>
      )}
    </div>
  );
};

export default ParagraphBlock;
