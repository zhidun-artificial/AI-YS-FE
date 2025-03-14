// import { useAccessMarkedRoutes } from '@@/plugin-access';
import routes from '@/routes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { matchPath, useLocation, useNavigate } from '@umijs/max';
import { Button } from 'antd';
import './Layout.css';

interface IBestAFSRoute {
  path?: string;
  name?: string;
  menu?: {
    category: string;
    sort: number;
  };
}

console.log('routes', routes);
const menus = (routes as IBestAFSRoute[]).filter((item) => item.menu);

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
        <ul className="flex flex-col items-center gap-5">
          {menus.map((item: any) => {
            const matched = matchPath({ path: item.path || '/' }, pathname);
            return (
              <li
                key={item.name}
                className={`${matched ? 'bg-[#F3F4F7]' : ''} ${'flex-row leading-[56px] pl-4 h-[56px] gap-4'} hover:cursor-pointer w-full rounded-xl flex items-center hover:bg-[#F3F4F7]`}
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
      </div>
    </div>
  );
};
