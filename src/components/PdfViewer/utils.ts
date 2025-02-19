import { ParagraphMeta } from '.';

export const getMinPercentValue = (a: string, b: string): string => {
  const aNum = parseFloat(`${a}`);
  const bNum = parseFloat(`${b}`);
  return `${Math.min(aNum, bNum)}%`;
};

export const getMaxRect = (curRect: DOMRect, nextRect: DOMRect): DOMRect => {
  const top = Math.min(curRect.top, nextRect.top);
  const left = Math.min(curRect.left, nextRect.left);
  const right = Math.max(curRect.right, nextRect.right);
  const bottom = Math.max(curRect.bottom, nextRect.bottom);
  return new DOMRect(left, top, right - left, bottom - top);
};

export const getPosStyle = (
  curParagraph: ParagraphMeta,
  nextRect: DOMRect,
  dom: HTMLElement,
): { left: string; top: string } => {
  const { posStyle, rect } = curParagraph;
  return {
    left: nextRect.left < rect.left ? dom.style.left : posStyle.left,
    top: nextRect.top < rect.top ? dom.style.top : posStyle.top,
  };
};
