// import { useAccessMarkedRoutes } from '@@/plugin-access';
import ConversationHistory from '@/components/ConversationHistory';
import UserInfo from '@/components/User/UserInfo';
import AgentList from '@/components/AgentList';
import routes, {
  managementName,
  managementPath,
  systemName,
  systemPath,
} from '@/routes';
import { AgenteItem, getAgentes } from '@/services/agent';
import { ConversationInfo } from '@/services/chat/getConversations';
import { getSystemConfig } from '@/services/system';
import {
  DownOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { matchPath, Outlet, useLocation, useNavigate } from '@umijs/max';
import { App, Button, Drawer, Layout, message } from 'antd';
import { useEffect, useState } from 'react';
import { Icon, Link, useModel, useRouteProps, history } from 'umi';
import AddAgent from '@/components/AgentList/AddAgent';
import './Layout.css';
import Logout from './Logout';
import SubMenu from './SubMenu';
import withThemeVars from './withThemeVars';

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

  const [agents, setAgents] = useState<AgenteItem[]>([]);
  const { pathname } = useLocation();
  const routeProps = useRouteProps();
  const { globalInfo } = useModel('global');
  const { user } = useModel('user');
  const [routeObject, setRouteObject] = useState<{
    [key: string]: { categoryName: string; items: RouteItem[] };
  }>(menus);
  const [url] = useState<string>(
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  );
  const [showConversations, setShowConversations] = useState(false);
  const [showAngets, setShowAngets] = useState(false);
  const [searchTime, setSearchTime] = useState(Date.now());
  const [systemInfo, setSystemInfo] = useState<any>({});

  const [modalVisit, setModalVisit] = useState(false);
  // 点击助理或者历史会话
  const onClickSubMenu = (e: any) => {
    console.log('onClickSubMenu', e);
    if (e.function === 'showMore') {
      if (!showConversations) setSearchTime(Date.now());
      setShowConversations(!showConversations);
    } else if (e.function === 'addAgent') {
      setModalVisit(true);
    } else if (e.function === 'showAgentList') {
      setShowAngets(true);
    } else if (e.type === 'agent') {
      console.log(e.id)
      history.push(`/new/${Date.now()}`, { assistantId: e.id })
    }
  };

  const fetchAgents = async () => {
    const res = {
      history: [
        { name: 'History 1', icon: 'local:historyChat' },
        { name: 'History 2', icon: 'local:historyChat' },
        { name: '展示更多', icon: 'local:add', function: 'showMore' },
      ],
      agents: [] as any[],
    };
    const Response = await getAgentes({
      key: '',
      sort: 'CREATED_AT_ASC',
      forEdit: false,
      pageNo: 1,
      pageSize: 9999,
    });
    if (Response instanceof Error) {
      message.error('查询助理列表失败');
    } else if (Response.code === 0) {
      const data = Response.data?.records;
      setAgents(data);
      res.agents = [
        { name: '添加助理', icon: 'local:add', function: 'addAgent' },
        ...data.slice(0, 5).map((item: any) => ({
          ...item, type: 'agent'
        }))
      ]
      if (data.length > 5) res.agents.push({ name: '展示更多', icon: 'local:add', function: 'showAgentList' })
    }

    if (res) {
      setRouteObject((routeObject) => {
        const newRouteObject = { ...routeObject };
        newRouteObject['function'].items[1].customChildren = (
          <SubMenu items={res.agents} onClick={onClickSubMenu} />
        );
        newRouteObject['function'].items[2].customChildren = (
          <SubMenu items={res.history} onClick={onClickSubMenu} />
        );
        console.log(newRouteObject);
        return newRouteObject;
      });
    }
  };
  useEffect(() => {
    const fetchSystemConfig = async () => {
      const res = await getSystemConfig();
      if (!(res instanceof Error)) {
        const { logo, systemName } = res.data as any;
        setSystemInfo({ logo, systemName });
      }
    };

    fetchAgents();
    fetchSystemConfig();
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
  const onClose = () => {
    setModalVisit(false);
    fetchAgents();
  };
  return (
    <App>
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
          <div className="h-16 w-full flex justify-center items-center">
            <Link to="/home" className="flex flex-row items-center">
              <img className="flex-grow" src={systemInfo?.logo} alt="logo" />
              <span className="text-[#374151] font-normal text-lg">
                {systemInfo?.systemName}
              </span>
            </Link>
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
          <div className=" absolute bottom-0 w-full flex justify-start items-center">
            <span className=" text-sm italic text-gray-500">
              构建时间：{globalInfo.buildTime}
            </span>
          </div>
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
              <UserInfo avatar={url} name={user.name} title={'超级管理员'} />
              <Logout></Logout>
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
            <AgentList onClick={onClickSubMenu} agents={agents} showAngets={showAngets} setShowAngets={setShowAngets}></AgentList>
            <Outlet></Outlet>
          </div>

        </div >
      </div >
    </App >
  );
};

export default withThemeVars(AppLayout);
