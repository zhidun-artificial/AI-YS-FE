// import { useAccessMarkedRoutes } from '@@/plugin-access';
import FileNormalSVG from '@/assets/icons/file-normal.svg';
import FileSelectSVG from '@/assets/icons/file-select.svg';
import HistoryNormalSVG from '@/assets/icons/history-normal.svg';
import HistorySelectSVG from '@/assets/icons/history-select.svg';
import HomeSVG from '@/assets/icons/home-normal.svg';
import HomeSelectSVG from '@/assets/icons/home-select.svg';
import SettingNormalSVG from '@/assets/icons/setting-normal.svg';
import SettingSelectSVG from '@/assets/icons/setting-select.svg';
import LogoPNG from '@/assets/images/logo.png';
import NamePNG from '@/assets/images/name.png';
import ConversationHistory from '@/components/ConversationHistory';
import { ConversationInfo } from '@/services/chat/getConversations';
import { useModel } from '@@/plugin-model';
import {
  LeftOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Link,
  matchPath,
  Outlet,
  useAppData,
  useLocation,
  useNavigate,
  useSelectedRoutes,
} from '@umijs/max';
import { Avatar, Button, Drawer, Dropdown, MenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useEffect, useState } from 'react';
import './Layout.css';

const IconMap: {
  [key: string]: { icon: JSX.Element; iconSelect: JSX.Element };
} = {
  首页: {
    icon: <img src={HomeSVG} className="w-8" style={{ height: '32px' }} />,
    iconSelect: (
      <img src={HomeSelectSVG} className="w-8" style={{ height: '32px' }} />
    ),
  },
  对话: {
    icon: (
      <img src={HistoryNormalSVG} className="w-8" style={{ height: '32px' }} />
    ),
    iconSelect: (
      <img src={HistorySelectSVG} className="w-8" style={{ height: '32px' }} />
    ),
  },
  文库: {
    icon: (
      <img src={FileNormalSVG} className="w-8" style={{ height: '32px' }} />
    ),
    iconSelect: (
      <img src={FileSelectSVG} className="w-8" style={{ height: '32px' }} />
    ),
  },
  系统管理: {
    icon: (
      <img src={SettingNormalSVG} className="w-8" style={{ height: '32px' }} />
    ),
    iconSelect: (
      <img src={SettingSelectSVG} className="w-8" style={{ height: '32px' }} />
    ),
  },
  历史会话: {
    icon: (
      <img src={HistoryNormalSVG} className="w-8" style={{ height: '32px' }} />
    ),
    iconSelect: (
      <img src={HistorySelectSVG} className="w-8" style={{ height: '32px' }} />
    ),
  },
};

export default () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { routes } = useAppData();
  const selectRoutes = useSelectedRoutes();
  const [collapsed, setCollapsed] = useState(true);
  const [showConversations, setShowConversations] = useState(false);
  const [searchTime, setSearchTime] = useState(Date.now());

  const initialInfo = useModel && useModel('@@initialState');

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '退出登陆',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.clear();
        navigate('/login');
      },
    },
  ];

  const { initialState, refresh } = initialInfo;
  // 过滤一级菜单
  const allMenus = Object.values(routes).filter((item) => {
    return item.parentId === '@@/global-layout';
  });
  const menus = allMenus
    .filter((_, index) => [1, 3, 4].includes(index))
    .filter((item) => {
      if (
        'access' in item &&
        initialState &&
        typeof initialState === 'object'
      ) {
        return Boolean(
          (initialState as Record<string, unknown>)[item.access as string],
        );
      } else {
        return false;
      }
    });

  const subMenus = Object.values(routes)
    .filter((item) => {
      return item.parentId === '7' && !('notShowInMenu' in item); // 寻找所有位于系统管理下的菜单
    })
    .filter((item) => {
      if (
        'access' in item &&
        initialState &&
        typeof initialState === 'object'
      ) {
        return Boolean(
          (initialState as Record<string, unknown>)[item.access as string],
        );
      } else {
        return false;
      }
    })
    .map((item) => {
      const { name = 'unNamed' } = item as any;
      return {
        key: item.path,
        label: <Link to={item.path ?? '/'}>{name}</Link>,
      };
    });
  console.log('routes', routes, initialState);

  const clientRoute = selectRoutes[selectRoutes.length - 1].route;
  const accessKey = (clientRoute as any).access; // 获取当前路由的accessKey
  const canAccessCurrentPage = (initialState as Record<string, unknown>)[
    accessKey
  ] as boolean;
  console.log('canAccessCurrentPage', canAccessCurrentPage, accessKey);

  if (clientRoute.path === '/') navigate('/login');

  useEffect(() => {
    refresh();
  }, [accessKey]);

  const onCreateNewConversation = () => {
    navigate(`/new/${Date.now()}`);
  };

  const onClickMenuItem = (e: any) => {
    navigate(e.path);
  };

  const onSelectConversation = (conversation: ConversationInfo) => {
    setShowConversations(false);
    navigate(`/chat/${conversation.id}`);
  };

  return (
    <div className="flex bg-[url('@/assets/images/bg.png')] bg-[length:100%_100%]">
      <div
        id="sideMenu"
        className={`${
          collapsed ? 'w-[80px] px-[7px]' : 'w-[260px] px-4'
        } side h-[100vh] bg-[#ffffff] shadow-md  flex-shrink-0 relative z-50`}
      >
        <div
          className="h-[60px] w-[22px] bg-white rounded-xl absolute -right-[30px] top-1/2 flex justify-center items-center hover:cursor-pointer z-50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <RightOutlined style={{ color: '#97A2BB' }} />
          ) : (
            <LeftOutlined style={{ color: '#97A2BB' }} />
          )}
        </div>
        <div className="flex flex-col items-center">
          <img src={LogoPNG} alt="logo" className="h-[65px] w-[65px] mt-6" />
          {!collapsed && (
            <img
              src={NamePNG}
              alt="name"
              className="h-[36px] w-[227px] mt-[14px]"
            />
          )}
        </div>
        {collapsed ? (
          <div
            className="bg-[#E1EBFC] h-[56px] w-[56px] flex justify-center items-center rounded-xl ml-1 mb-9 mt-[46px] hover:cursor-pointer"
            onClick={onCreateNewConversation}
          >
            <PlusCircleOutlined
              style={{ color: '#004EFF', fontSize: '29px' }}
            />
          </div>
        ) : (
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            className={` mt-6 mb-7 !w-full h-[56px]`}
            size="large"
            onClick={onCreateNewConversation}
          >
            {!collapsed && '创建新对话'}
          </Button>
        )}
        <ul className="flex flex-col items-center gap-5">
          {menus.map((item: any) => {
            const matched = matchPath({ path: item.path || '/' }, pathname);
            if (item.name === '系统管理') {
              const specialMatch = pathname.includes('/setting');
              return (
                <Dropdown
                  key={item.name}
                  menu={{ items: subMenus as ItemType[], selectable: true }}
                >
                  <li
                    key={item.name}
                    className={`${specialMatch ? 'bg-[#F3F4F7]' : ''} ${
                      collapsed
                        ? 'flex-col leading-4 h-[82px] gap-3 bg-transparent justify-center'
                        : 'flex-row leading-[56px] pl-4 h-[56px] gap-4'
                    } hover:cursor-pointer w-full rounded-xl flex items-center hover:bg-[#F3F4F7]`}
                  >
                    {specialMatch
                      ? IconMap[item.name ?? '']?.iconSelect
                      : IconMap[item.name ?? '']?.icon}
                    <span
                      className={`${
                        specialMatch
                          ? 'text-[#000614] font-medium'
                          : 'text-[#586A92] font-normal'
                      } text-lg}`}
                    >
                      {item.name}
                    </span>
                  </li>
                </Dropdown>
              );
            }
            return (
              <li
                key={item.name}
                className={`${matched ? 'bg-[#F3F4F7]' : ''} ${
                  collapsed
                    ? 'flex-col leading-4 h-[82px] gap-3 bg-transparent justify-center'
                    : 'flex-row leading-[56px] pl-4 h-[56px] gap-4'
                } hover:cursor-pointer w-full rounded-xl flex items-center hover:bg-[#F3F4F7]`}
                onClick={() => onClickMenuItem(item)}
              >
                {matched
                  ? IconMap[item.name ?? '']?.iconSelect
                  : IconMap[item.name ?? '']?.icon}
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
          <li
            className={`${
              collapsed
                ? 'flex-col leading-4 h-[82px] gap-3 bg-transparent justify-center'
                : 'flex-row leading-[56px] pl-4 h-[56px] gap-4'
            } hover:cursor-pointer w-full rounded-xl flex items-center hover:bg-[#F3F4F7]`}
            onClick={() => {
              setShowConversations(!showConversations);
              setSearchTime(Date.now());
            }}
          >
            {showConversations
              ? IconMap['历史会话']?.iconSelect
              : IconMap['历史会话']?.icon}
            <span
              className={`${
                showConversations
                  ? 'text-[#000614] font-medium'
                  : 'text-[#586A92] font-normal'
              } text-lg}`}
            >
              历史会话
            </span>
          </li>
        </ul>
        <Dropdown menu={{ items }}>
          <div
            className={`${
              collapsed ? 'flex-col gap-2' : 'flex-row items-center gap-5'
            } flex p-4 hover:cursor-pointer fixed bottom-0`}
          >
            <Avatar size={40} icon={<UserOutlined />}></Avatar>
            <span
              className={`${
                collapsed ? 'w-[66px] text-center overflow-hidden -ml-4' : ''
              }`}
            >
              {localStorage.getItem('zd_user_name')}
            </span>
            {/* {!collapsed && <span>{localStorage.getItem('zd_user_name')}</span>} */}
          </div>
        </Dropdown>
      </div>
      <div id="appContent" className="flex-1 h-screen relative overflow-hidden">
        <Drawer
          placement="left"
          mask={true}
          title="历史会话"
          getContainer={'#appContent'}
          rootStyle={{ position: 'absolute', zIndex: 40 }}
          styles={{
            content: { background: '#F5F8FD' },
            mask: { background: 'rgba(0, 0, 0, 0.1)' },
          }}
          open={showConversations}
          onClose={() => setShowConversations(false)}
        >
          <ConversationHistory
            searchTime={searchTime}
            onSelectConversation={onSelectConversation}
          ></ConversationHistory>
        </Drawer>
        {canAccessCurrentPage && <Outlet />}
      </div>
    </div>
  );
};
