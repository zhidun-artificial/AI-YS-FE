import { ReactComponent as SvgDirComponent } from '@/assets/svg/dir.svg';
import { ReactComponent as SvgPdfComponent } from '@/assets/svg/pdf.svg';
import { ReactComponent as SvgWordComponent } from '@/assets/svg/word.svg';
import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export const IconDir = (props: IconComponentProps) => (
  <Icon component={SvgDirComponent} {...props} />
);
export const IconPdfFile = (props: IconComponentProps) => (
  <Icon component={SvgPdfComponent} {...props} />
);
export const IconWordFile = (props: IconComponentProps) => (
  <Icon component={SvgWordComponent} {...props} />
);
