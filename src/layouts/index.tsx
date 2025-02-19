// import { useAccessMarkedRoutes } from '@@/plugin-access';
import routes from '@/routes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { matchPath, Outlet, useLocation, useNavigate } from '@umijs/max';
import { Button } from 'antd';
import './Layout.css';

interface IBestAFSRoute {
  path?: string;
  name?: string;
  menu?: {
    category: string;
    categoryName: string;
    sort: number;
    hidden?: boolean;
  };
}

const menuList = (routes as IBestAFSRoute[]).filter(
  (item) => item.menu && !item.menu.hidden,
);

// 按照 menu 中的 category 分组
const menus = menuList.reduce(
  (
    prev: { [key: string]: { categoryName: string; items: IBestAFSRoute[] } },
    curr,
  ) => {
    const { category, categoryName = '' } = curr.menu || {};
    if (!category) return prev;
    if (!prev[category]) {
      prev[category] = {
        categoryName,
        items: [],
      };
    }
    prev[category].items.push(curr);
    return prev;
  },
  {},
);

export default () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onCreateNewConversation = () => {
    navigate(`/new/${Date.now()}`);
  };

  const onClickMenuItem = (e: any) => {
    navigate(e.path);
  };

  return (
    <div className="flex bg-[url('@/assets/images/bg.png')] bg-[length:100%_100%]">
      <div
        id="sideMenu"
        className="w-[255px] p-4 side h-[100vh] bg-[#ffffff] shadow-md  flex-shrink-0 relative z-50"
      >
        <div className="flex flex-col items-center"></div>

        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          className={` mt-6 mb-7 !w-full h-[40px]`}
          onClick={onCreateNewConversation}
        >
          {'创建新对话'}
        </Button>

        {Object.values(menus).map((menu: any, index: number) => {
          const categoryName = menu.categoryName;
          return (
            <>
              <div className="text-[#6B7280] text-xs leading-4 font-medium mb-4 pl-4">
                {categoryName}
              </div>
              <ul key={index} className="flex flex-col items-center">
                {menu.items.map((item: IBestAFSRoute) => {
                  const matched = matchPath(
                    { path: item.path || '/' },
                    pathname,
                  );
                  return (
                    <li
                      key={item.name}
                      className={`${matched ? 'bg-[#F3F4F6]' : 'hover:bg-[#F3F4F6]'} ${'flex-row leading-[40px] pl-4 h-[40px]'} hover:cursor-pointer w-full rounded flex items-center `}
                      onClick={() => onClickMenuItem(item)}
                    >
                      <span
                        className={`${
                          matched
                            ? 'text-[#000614] font-medium'
                            : 'text-[#586A92] font-normal'
                        } text-lg}`}
                      >
                        {item.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          );
        })}
      </div>
      <div className="flex-1 h-[100vh] overflow-auto px-4">
        <Outlet></Outlet>
      </div>
    </div>
  );
};
