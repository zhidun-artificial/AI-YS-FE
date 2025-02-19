import debounce from 'lodash/debounce';
import {
  PDFDocumentProxy,
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';
import React, { useEffect, useRef, useState } from 'react';
import { Document, DocumentProps, Page, pdfjs } from 'react-pdf';
import TransBlock, { TransBlockProps } from './TransBlock';
import { getMaxRect, getPosStyle } from './utils';

import { DocFileInfo } from '@/services/chat/chatConversation';
import { translateToZh } from '@/services/translate/translateToZh';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Empty, message, Select } from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import ParagraphBlock, { ParagraphBlockProps } from './ParagraphBlock';
import ScaleControl from './ScaleControl';

// const workerSrc = new URL(
//   'pdf.worker.min.js',
//   import.meta.url,
// ).toString();

// console.log('workerSrc', workerSrc);
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/${process.env.BASE_URL}/pdf.worker.min.mjs`;

export interface PDFViewerProps {
  files?: DocFileInfo[];
  onExit?: () => void;
  onAction?: (action: string, content: string) => void;
  onModeChange?: (mode: 'original' | 'translate') => void;
}

interface ParagraphBlockMeta {
  id: string;
  content: string;
  top: string;
  left: string;
  width: number;
  height: number;
  fontSize: number;
}

export interface ParagraphMeta {
  chunks: Array<string>;
  posStyle: { left: string; top: string };
  fontSize: number;
  rect: DOMRect;
}

export function isTextItem(
  item: TextItem | TextMarkedContent,
): item is TextItem {
  return 'str' in item;
}

const getTextItemFontSize = (item: TextItem): number => {
  return Math.abs(item.transform[0]);
};

const updateParagraph = (
  paragraph: ParagraphMeta | null,
  dom: HTMLElement,
  textItem: TextItem,
): ParagraphMeta => {
  if (!paragraph) {
    return {
      chunks: [textItem.str],
      posStyle: {
        left: dom.style.left,
        top: dom.style.top,
      },
      fontSize: getTextItemFontSize(textItem),
      rect: dom.getBoundingClientRect(),
    };
  } else {
    const chunks = [...paragraph.chunks, textItem.str];
    const curRect = dom.getBoundingClientRect();
    const rect = getMaxRect(paragraph.rect, curRect);
    const style = getPosStyle(paragraph, curRect, dom);
    return {
      chunks,
      posStyle: style,
      fontSize: Math.max(paragraph.fontSize, getTextItemFontSize(textItem)),
      rect,
    };
  }
};

const predictNewParagraph = (
  oldItem: TextItem | null,
  newItem: TextItem,
): boolean => {
  if (!oldItem) return false;
  const verticalSpacing = newItem.transform[5] - oldItem.transform[5];
  return Math.abs(verticalSpacing) > 1.5 * newItem.height;
};

const transMessageHandler = async (
  message: string,
): Promise<string | Error> => {
  const res = await translateToZh(message);
  if (res instanceof Error) {
    return res;
  }
  return res.code === 0 ? res.data[0]?.target || '' : res.msg;
};

const PDFViewer: React.FC<PDFViewerProps> = ({
  files = [],
  onExit,
  onAction,
  onModeChange,
}) => {
  const [selectFile, setSelectFile] = useState<string>(files[0]?.url || '');
  const [selectFileId, setSelectFileId] = useState<string>(files[0]?.id || '');
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [mode, setMode] = useState<'original' | 'translate'>('original');
  const [paragraphs, setParagraphs] = useState<
    Array<Array<ParagraphBlockMeta>>
  >([]);
  const [renderFinish, setRenderFinish] = useState(false);
  const orgDocumentRef = useRef<HTMLDivElement>(null);
  const paragraphsTemp = useRef<Array<Array<ParagraphBlockMeta>>>([]);
  const [highlightParaId, setHighlightParaId] = useState<string>('');
  const [stageScale, setStageScale] = useState(1);
  const [fullPage, setFullPage] = useState(false);

  // 选择文件
  const onSelectFileChange = (fileId: string) => {
    setSelectFileId(fileId);
    const file = files.find((f) => f.id === fileId);
    if (file) {
      setStageScale(1);
      setRenderFinish(false);
      setSelectFile(file.url);
    }
  };

  // 文档加载成功
  const onDocumentLoadSuccess: DocumentProps['onLoadSuccess'] = (pdf) => {
    setPdf(pdf);
  };

  // 文字层渲染完毕
  const onRenderTextLayerSuccess = async (pageIndex: number) => {
    // if (index !== 1) return;
    if (renderFinish) return;
    if (!pdf) return;
    // 获取当前页的文字层
    const textLayer = document.querySelector(
      `[data-page-number="${pageIndex}"] .react-pdf__Page__textContent`,
    );
    if (!textLayer) throw new Error(`[page-${pageIndex}] textLayer not found`);
    // 获取文字层的所有子元素
    const layerChildren = textLayer.querySelectorAll<HTMLElement>(
      '[role="presentation"]',
    );
    // 获取当前页的文字块
    const page = await pdf?.getPage(pageIndex);
    const textContent = await page?.getTextContent();
    if (!textContent)
      throw new Error(`[page-${pageIndex}] textContent not found`);

    const paraMetaList: Array<ParagraphMeta> = [];
    let curParaMeta: ParagraphMeta | null = null;
    let curDom: HTMLElement | null = null;
    let preBlock: TextItem | null = null;
    let domIndex = 0;

    textContent.items.forEach((block) => {
      // 标准文本块
      if (isTextItem(block)) {
        // 当前文本块的dom
        curDom = layerChildren[domIndex];
        if (!curDom) return;

        if (curDom.tagName !== 'BR') {
          // 判定为新的一行,则处理上一行
          if (predictNewParagraph(preBlock, block)) {
            if (curParaMeta) paraMetaList.push(curParaMeta); // 当前段落信息存储
            curParaMeta = updateParagraph(null, curDom, block); // 更新为新的一行
          } else {
            curParaMeta = updateParagraph(curParaMeta, curDom, block);
          }

          preBlock = block;
        }
        // 更新索引
        domIndex += block.str && block.hasEOL ? 2 : 1;
      }
    });

    if (
      curParaMeta !== null &&
      (curParaMeta as ParagraphMeta).chunks.length > 0
    ) {
      paraMetaList.push(curParaMeta);
    }

    // setParaMetaList(paraMetaList);

    const paragraph: ParagraphBlockMeta[] = paraMetaList.map((p, i) => ({
      id: `page-${pageIndex}-para-${i}`,
      content: p.chunks.join(' '),
      top: p.posStyle.top,
      left: p.posStyle.left,
      width: p.rect.width,
      height: p.rect.height,
      fontSize: p.fontSize,
    }));

    paragraphsTemp.current[pageIndex - 1] = paragraph;
    // console.log(`page: ${index} >>>>>>>>`, paragraphsTemp.current.length);
    if (paragraphsTemp.current.filter(Boolean).length === pdf.numPages) {
      setRenderFinish(true);
      setParagraphs([...paragraphsTemp.current]);
      paragraphsTemp.current = [];
    }

    // dispatch({ type: 'add', pageIndex: index, paragraph });

    //setParagraphs([...paragraphs.slice(0, index - 1), paragraph, ...paragraphs.slice(index)]);
    // setParagraphMap(new Map(paragraphMap));
    // console.log("======", paraMetaList);
  };

  // 高亮当前鼠标所在的段落
  useEffect(() => {
    const onDocumentMouseMove = debounce((event: MouseEvent) => {
      console.log('detect');
      if (renderFinish === false) return;
      const elements = document.elementsFromPoint(event.clientX, event.clientY);
      const paragraph = elements.find((element) =>
        element.classList.contains('paragraph-mask'),
      );
      if (paragraph) {
        setHighlightParaId(paragraph.getAttribute('data-para-id') || '');
      } else {
        setHighlightParaId('');
      }
    }, 200);
    orgDocumentRef.current?.addEventListener('mousemove', onDocumentMouseMove);

    return () => {
      orgDocumentRef.current?.removeEventListener(
        'mousemove',
        onDocumentMouseMove,
      );
    };
  });

  const onParagraphBlockAction: ParagraphBlockProps['onBlockAction'] = (
    action,
    { paragraphId, content },
  ) => {
    if (action === 'interpret') {
      console.log('interpret', paragraphId, content);
      if (onAction) onAction('interpret', content);
    } else if (action === 'translate') {
      console.log('translate', paragraphId, content);
      if (onAction) onAction('translate', content);
    } else if (action === 'copy') {
      message.success('复制成功');
    }
  };

  const onTransHighlight = (paragraphId: string) => {
    setHighlightParaId(paragraphId);
  };

  const onTransBlockAction: TransBlockProps['onBlockAction'] = (
    action,
    params,
  ) => {
    if (action === 'interpret') {
      console.log('interpret', params.paragraphId, params.content);
      if (onAction) onAction('interpret', params.content);
    } else if (action === 'copy') {
      message.success('复制成功');
    }
  };

  return (
    <div
      className={`${
        fullPage ? 'fixed inset-0 z-50' : ''
      } w-full h-full flex flex-col bg-white overflow-hidden`}
    >
      <div className="h-10 flex flex-row gap-4 justify-center items-center bg-white border-b border-solid border-gray-200">
        <ScaleControl
          value={stageScale}
          onScaleChange={(v) => setStageScale(v)}
        ></ScaleControl>
        <Select
          style={{ width: 300 }}
          onChange={onSelectFileChange}
          value={selectFileId}
        >
          {files.map((file) => (
            <Select.Option key={file.id} value={file.id}>
              {file.fileName}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={() => {
            const nextMode = mode === 'original' ? 'translate' : 'original';
            const nextScale = nextMode === 'original' ? 1 : 0.8;
            setMode(nextMode);
            setStageScale(nextScale);
            if (onModeChange) onModeChange(nextMode);
          }}
        >
          {mode === 'original' ? '翻译模式' : '阅读模式'}
        </Button>
        <Button
          icon={fullPage ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          title={fullPage ? '退出全屏' : '全屏'}
          onClick={() => setFullPage(!fullPage)}
        ></Button>
        <Button
          type="text"
          onClick={() => {
            if (onExit) onExit();
          }}
        >
          退出
        </Button>
      </div>
      <div className="w-full flex-1 overflow-auto">
        {!selectFile ? (
          <Empty>请选择文件</Empty>
        ) : (
          <div
            key={selectFile}
            className="flex flex-row h-full"
            style={{ transform: `scale(${stageScale})` }}
          >
            <Document
              key={selectFile}
              file={selectFile}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <div ref={orgDocumentRef}>
                {Array.from(new Array(pdf?.numPages || 0), (_, index) => (
                  <Page
                    scale={1.5}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    // onLoadSuccess={onPageLoadSuccess}
                    onRenderTextLayerSuccess={() =>
                      onRenderTextLayerSuccess(index + 1)
                    }
                  >
                    {paragraphs[index]?.map((p) => (
                      <ParagraphBlock
                        id={p.id}
                        key={p.id}
                        highlighted={highlightParaId === p.id}
                        originalContent={p.content}
                        style={{
                          top: p.top,
                          left: p.left,
                          width: p.width,
                          height: p.height,
                        }}
                        onBlockAction={onParagraphBlockAction}
                      ></ParagraphBlock>
                    ))}
                  </Page>
                ))}
              </div>
            </Document>
            {mode === 'translate' && (
              <Document file={selectFile}>
                {Array.from(new Array(pdf?.numPages || 0), (_, index) => (
                  <Page
                    scale={1.5}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  >
                    {paragraphs[index]?.map((p) => (
                      <TransBlock
                        id={p.id}
                        key={p.id}
                        style={{
                          top: p.top,
                          left: p.left,
                          width: p.width,
                          height: p.height,
                          fontSize: `${
                            p.fontSize > 20 ? p.fontSize : p.fontSize * 1.5
                          }px`,
                        }}
                        highlighted={highlightParaId === p.id}
                        originalContent={p.content}
                        transHandler={transMessageHandler}
                        onBlockSelect={onTransHighlight}
                        onBlockAction={onTransBlockAction}
                      ></TransBlock>
                    ))}
                  </Page>
                ))}
              </Document>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
