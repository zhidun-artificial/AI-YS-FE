import { copyTextToClipboard } from '@/utils/clipboard';
import useOnceInViewport from '@/utils/hooks/useOnceInViewport';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useRef, useState } from 'react';

export interface TransBlockProps {
  id: string;
  style: React.CSSProperties;
  highlighted: boolean;
  originalContent: string;
  transHandler: (message: string) => Promise<string | Error>;
  onBlockSelect?: (paragraphId: string) => void;
  onBlockAction?: (
    action: BlockAction,
    params: { paragraphId: string; content: string },
  ) => void;
}

type BlockAction = 'interpret' | 'copy';

const TransBlock: React.FC<TransBlockProps> = ({
  id,
  style,
  originalContent: originalMessage,
  transHandler,
  onBlockSelect,
  onBlockAction,
  highlighted = false,
}) => {
  const [finished, setFinished] = useState(false);
  const [transContent, setTransContent] = useState<string>('');
  const [showRetry, setShowRetry] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useOnceInViewport(domRef, async () => {
    if (finished) return;
    const transMessage = await transHandler(originalMessage);
    if (transMessage instanceof Error) {
      setFinished(true);
      setShowRetry(true);
    } else {
      setFinished(true);
      setTransContent(transMessage);
    }
  });

  const onRetry = async () => {
    const transMessage = await transHandler(originalMessage);
    if (transMessage instanceof Error) {
      setShowRetry(true);
    } else {
      setShowRetry(false);
      setTransContent(transMessage);
    }
  };

  const onBlockClick = () => {
    if (onBlockSelect) {
      onBlockSelect(id);
    }
  };

  const onClickInterpret = () => {
    if (onBlockAction)
      onBlockAction('interpret', { paragraphId: id, content: transContent });
  };

  const onClickCopy = async () => {
    await copyTextToClipboard(transContent);
    if (onBlockAction)
      onBlockAction('copy', { paragraphId: id, content: transContent });
  };

  return (
    <div
      ref={domRef}
      className={`paragraph-trans-mask absolute bg-white text-black  ${
        finished ? 'finished' : 'flex justify-center items-center'
      }`}
      data-para-id={id}
      style={{
        zIndex: highlighted ? 5 : 4,
        ...style,
      }}
      onClick={onBlockClick}
    >
      {finished && !showRetry ? (
        <div
          style={{ width: style.width, height: style.height, resize: 'both' }}
          className={`font-alibaba overflow-y-auto whitespace-pre-wrap break-words border border-solid border-transparent hover:border-[#BFCCEB] ${
            highlighted ? 'bg-[#BFCCEB]' : 'bg-white'
          }`}
        >
          {transContent}
        </div>
      ) : showRetry ? (
        <Button type="text" onClick={onRetry}>
          报错啦，重试
        </Button>
      ) : (
        <span>翻译中...</span>
      )}

      {highlighted && finished && !showRetry && (
        <div
          className="paragraph-trans-mask h-10 w-fit min-w-[160px] mt-1 flex justify-end items-center  px-4 border border-solid border-[#DDE1E9] bg-white text-[#000614] rounded-lg z-10"
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

export default TransBlock;
