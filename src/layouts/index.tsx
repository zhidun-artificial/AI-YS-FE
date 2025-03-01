// import { useAccessMarkedRoutes } from '@@/plugin-access';
import ConversationHistory from '@/components/ConversationHistory';
import UserInfo from '@/components/User/UserInfo';
import routes, {
  managementName,
  managementPath,
  systemName,
  systemPath,
} from '@/routes';
import { ConversationInfo } from '@/services/chat/getConversations';
import {
  DownOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { matchPath, Outlet, useLocation, useNavigate } from '@umijs/max';
import { Button, Drawer, Layout } from 'antd';
import { useEffect, useState } from 'react';
import { Icon, Link, useRouteProps } from 'umi';
import AddAgent from './AddAgent';
import './Layout.css';
import SubMenu from './SubMenu';
import withThemeVars from './withThemeVars';
import titleImg from '@/assets/images/title.png';

const { Header } = Layout;

interface RouteItem {
  path?: string;
  name?: string;
  icon?: string;
  showChildren?: boolean;
  routes?: RouteItem[];
  menu?: {
    category?: string;
    categoryName?: string;
    sort: number;
    hidden?: boolean;
  };
  customChildren?: React.ReactNode;
}

const menuList = ((routes as RouteItem[]) || []).filter(
  (item) => item.menu && !item.menu.hidden,
);

const managementChildren = menuList.filter(
  (item) => item.path === managementPath,
);

const systemChildren = menuList.filter((item) => item.path === systemPath);

// 按照 menu 中的 category 分组
const menus: { [key: string]: { categoryName: string; items: RouteItem[] } } =
  menuList.reduce(
    (
      prev: { [key: string]: { categoryName: string; items: RouteItem[] } },
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

// 增加我的助理和历史会话下拉菜单
menus['function'].items.push(
  {
    name: '我的助理',
    icon: 'local:agent',
    showChildren: true,
    menu: {
      sort: 2,
    },
    customChildren: null, // 将动态的数据放到 customChildren 中
  },
  {
    name: '历史会话',
    icon: 'local:history',
    showChildren: false,
    menu: {
      sort: 3,
    },
    customChildren: null, // 将动态的数据放到 customChildren 中
  },
);

menus['function'].items.sort(
  (a, b) => (a.menu?.sort ?? 0) - (b.menu?.sort ?? 0),
);

const AppLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const routeProps = useRouteProps();
  const [routeObject, setRouteObject] = useState<{
    [key: string]: { categoryName: string; items: RouteItem[] };
  }>(menus);
  const [url] = useState<string>(
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  );
  const [showConversations, setShowConversations] = useState(false);
  const [searchTime, setSearchTime] = useState(Date.now());

  const [modalVisit, setModalVisit] = useState(false);
  // 点击助理或者历史会话
  const onClickSubMenu = (e: any) => {
    console.log('onClickSubMenu', e);
    if (e.function === 'showMore') {
      if (!showConversations) setSearchTime(Date.now());
      setShowConversations(!showConversations);
    } else if (e.function === 'addAgent') {
      setModalVisit(true);
    }
  };
  const onClose = () => {
    setModalVisit(false);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      // 模拟网络延迟
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟返回数据
      const res = {
        agents: [
          { name: '添加助理', icon: 'local:add', function: 'addAgent' },
          { name: 'Agent 1', icon: 'local:agent' },
          { name: 'Agent 2', icon: 'local:agent' },
        ],
        history: [
          { name: 'History 1', icon: 'local:historyChat' },
          { name: 'History 2', icon: 'local:historyChat' },
          { name: '展示更多', icon: 'local:add', function: 'showMore' },
        ],
      };

      if (res) {
        setRouteObject((routeObject) => {
          const newRouteObject = { ...routeObject };
          newRouteObject['function'].items[1].customChildren = (
            <SubMenu items={res.agents} onClick={onClickSubMenu} />
          );
          newRouteObject['function'].items[2].customChildren = (
            <SubMenu items={res.history} onClick={onClickSubMenu} />
          );
          return newRouteObject;
        });
      }
    };

    fetchAgents();
  }, []);

  const onCreateNewConversation = () => {
    navigate(`/new/${Date.now()}`);
  };

  const onClickMenuItem = (e: any) => {
    if (e.path) {
      if (e.component) {
        navigate(e.path);
      } else {
        // 重定向到第一个子路由
        const firstChild = e.routes?.[0];
        if (firstChild) {
          navigate(`${firstChild.path}`);
        }
      }
    }
    if (e.customChildren) {
      e.showChildren = !e.showChildren;
      setRouteObject({ ...routeObject });
    }
  };

  const onSelectConversation = (conversation: ConversationInfo) => {
    setShowConversations(false);
    navigate(`/chat/${conversation.id}`);
  };

  let routeChildren;
  const isManagementRouteActive = pathname.includes(managementPath);
  const isSystemRouteActive = pathname.includes(systemPath);
  if (isManagementRouteActive) {
    routeChildren = managementChildren;
  } else {
    routeChildren = systemChildren;
  }

  return (
    <div className="flex">
      <div
        id="sideMenu"
        className="w-[255px] p-4 pt-0 side h-[100vh] bg-[#ffffff] shadow-md  flex-shrink-0 relative z-50 select-none"
      >
        <AddAgent onClose={onClose} modalVisible={modalVisit} />
        {/* 这里不知道为何必须这么才能显示下方菜单图标 */}
        <div style={{ display: 'none' }}>
          <Icon icon="local:chat" />
          <Icon icon="local:knowledge" />
          <Icon icon="local:search" />
          <Icon icon="local:setting" />
          <Icon icon="local:team" />
          <Icon icon="local:agent" />
          <Icon icon="local:history" />
          <Icon icon="local:historyChat" />
          <Icon icon="local:add" />
        </div>
        <div className="flex flex-col items-center"></div>
        <div className='h-16 w-full flex justify-center items-center'>
          <Link to='/home'><img className='w-[172px]' src={titleImg} alt="logo" /></Link>
        </div>
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          className={` mt-6 !w-full h-[40px]`}
          onClick={onCreateNewConversation}
        >
          {'创建新对话'}
        </Button>

        {Object.values(routeObject).map((menu: any, index: number) => {
          const categoryName = menu.categoryName;
          return (
            <div key={index}>
              <div className="text-[#6B7280] text-xs leading-4 font-medium mb-2 mt-6 pl-4">
                {categoryName}
              </div>
              <div className="flex flex-col items-center">
                {menu.items.map((item: RouteItem) => {
                  // 判断是否匹配效果并不好
                  const matched =
                    matchPath({ path: item.path || '/' }, pathname) ||
                    (isManagementRouteActive && item.path === managementPath) || // 如果是管理页面，需要额外判断
                    (isSystemRouteActive && item.path === systemPath);
                  return (
                    <div key={item.path || item.name} className="w-full">
                      <div
                        className={`${matched ? 'bg-[#F3F4F6]' : 'hover:bg-[#F3F4F6]'} ${'flex-row leading-[40px] pl-4 h-[40px]'} hover:cursor-pointer w-full rounded flex items-center `}
                        onClick={() => onClickMenuItem(item)}
                      >
                        <Icon
                          icon={(item.icon || 'local:knowledge') as any}
                          className="mr-[12px]"
                        />
                        <span
                          className={`${matched
                            ? 'text-[#374151] font-medium'
                            : 'text-[#4B5563] font-normal'
                            } text-lg flex-grow`}
                        >
                          {item.name}
                        </span>
                        {item.customChildren &&
                          (item.showChildren ? (
                            <DownOutlined className="mr-[18px]" />
                          ) : (
                            <RightOutlined className="mr-[18px]" />
                          ))}
                      </div>
                      {/* 下拉菜单 */}
                      {item.showChildren && item.customChildren}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <Header className="p-0 !bg-white shadow flex items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-[#1F2937] text-lg font-medium">
              {`${isManagementRouteActive ? managementName : isSystemRouteActive ? systemName : routeProps.name}`}
            </h1>
            {(isManagementRouteActive || isSystemRouteActive) && (
              <ul className="flex h-[42px] gap-4 ml-8">
                {routeChildren[0]?.routes?.map((item: any) => {
                  const matched = matchPath(
                    { path: item.path || '/' },
                    pathname,
                  );
                  return (
                    <li
                      key={item.path}
                      className={`${matched ? 'text-[#4F46E5] font-medium border-b-2 border-[#4F46E5] pb-1' : 'text-[#4B5563] font-normal'} leading-[42px] rounded`}
                    >
                      <Link to={item.path} className="mx-4">
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="flex items-center">
            <UserInfo avatar={url} name={'张信服'} title={'超级管理员'} />
          </div>
        </Header>
        <div
          id="appContent"
          style={{ height: 'calc(100% - 64px)' }}
          className="flex-1 bg-gray-100 p-6 relative"
        >
          <Drawer
            placement="left"
            mask={true}
            title="历史会话"
            getContainer={'#appContent'}
            rootStyle={{ position: 'absolute', zIndex: 40 }}
            styles={{
              content: { background: '#FFF' },
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
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default withThemeVars(AppLayout);
