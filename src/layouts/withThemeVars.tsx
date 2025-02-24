import { GetProps } from "antd";
import { useTheme } from "antd-style";

const withThemeVars = (Component: React.ComponentType) => {
  return (props: GetProps<typeof Component>) => {
    const { colorPrimary, colorInfoBg, colorPrimaryBg, colorBorder, colorPrimaryBorder } = useTheme()
    return (
      <>
        <style>
          {`:root {
          --color-primary: ${colorPrimary};
          --color-bg: ${colorInfoBg};
          --color-bg-hover: ${colorPrimaryBg};
          --color-border: ${colorBorder};
          --color-border-hover: ${colorPrimaryBorder};
        }`}
        </style>
        <Component {...props} />;
      </>)
  };
}

export default withThemeVars;