// 运行时配置
import "@/polyfills/text-encode-transform.js"
import { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { AxiosError, history, matchRoutes, RuntimeConfig } from 'umi';
import './app.css';
import { ApiResponse } from './services/http';
import { getPermissions, RoleDetail } from './services/user/role';
import { STORE_KEY_TOKEN, STORE_KEY_USER_ROLE } from './constants';

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

document.title = 'AI知识服务系统';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<
  | {
    name: string;
    auth?: RoleDetail;
    [x: string]: any;
  }
  | undefined
> {
  const pageAccess = {
    canAccessHome: false,
    canAccessChat: false,
    canAccessDocument: false,
    canAccessSetting: false,
    canAccessDoc: false,
    canAccessDocDetail: true,
    canAccessRole: false,
    canAccessUser: false,
    canAccessSensitive: false,
    canAccessLog: false,
    canAccessSystem: false,
    canAccessNew: false,
  };
  const roleId = localStorage.getItem(STORE_KEY_USER_ROLE);
  if (!roleId) {
    return {
      name: 'AI知识服务系统',
      ...pageAccess,
    };
  }
  const authRes = await getPermissions(Number(roleId));
  if (authRes instanceof Error) {
    // message.error(authRes.message);
    return {
      name: 'AI知识服务系统',
      ...pageAccess,
    };
  }
  if (authRes.code === 0) {
    const canAccessPathList = authRes.data.data.map(
      (item) => item.has && item.name,
    );
    return {
      name: 'AI知识服务系统',
      auth: authRes.data,
      ...pageAccess,
      canAccessHome: canAccessPathList.includes('/home'),
      canAccessChat: canAccessPathList.includes('/chat/:id'),
      canAccessDocument: canAccessPathList.includes('/document'),
      canAccessSetting: canAccessPathList.includes('/setting'),
      canAccessDoc: canAccessPathList.includes('/setting/doc'),
      canAccessRole: canAccessPathList.includes('/setting/role'),
      // canAccessRole: true,
      canAccessUser: canAccessPathList.includes('/setting/user'),
      canAccessSensitive: canAccessPathList.includes('/setting/sensitive'),
      canAccessLog: canAccessPathList.includes('/setting/log'),
      canAccessSystem: canAccessPathList.includes('/setting/system'),
      canAccessNew: canAccessPathList.includes('/new/:id'),
    };
  }
}

export const request: RequestConfig = {
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem(STORE_KEY_TOKEN);
      const headers = {
        // Authorization: `Bearer ${token}`,
        Auth: token || '',
      };
      return {
        url,
        options: { ...options, headers },
      };
    },
  ],
  responseInterceptors: [
    // token过期处理
    [
      (response) => {
        if (response.headers.auth) {
          localStorage.setItem(STORE_KEY_TOKEN, response.headers.auth);
        }
        return response;
      },
      (error) => {
        if (isAxiosError(error)) {
          if (
            history.location.pathname !== '/login' &&
            error.response?.status === 403
          ) {
            localStorage.clear(); // 清除token等信息
            message.error('用户登录过期，请先登录');
            history.push('/login');
          } else {
            message.error((error.response?.data as ApiResponse<unknown>)?.msg);
          }
        }
        return Promise.reject(error);
      },
    ],
    [
      (response) => {
        const res = response.data as ApiResponse<unknown>;
        if (res.code !== 0) {
          message.error(res.msg);
        }
        return response;
      },
    ],
    [
      (response) => {
        const res = response.data as ApiResponse<unknown>;
        // 登录token有效 login 页面直接跳转到 home 页面
        if (res.code === 0 && history.location.pathname === '/login') {
          history.push('/home');
          return response;
        }
        return response;
      },
    ],
  ],
};

export const onRouteChange: RuntimeConfig['onRouteChange'] = ({
  clientRoutes,
  location,
}) => {
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route?.path === '/login') return;
  const token = localStorage.getItem(STORE_KEY_TOKEN);
  if (!token) {
    if (route?.path === '/') {
      history.push('/login');
    } else if (route?.path !== '/login' && route?.path !== '/register') {
      // message.error('用户登录过期，请先登录'); //登录成功后会有提示
      history.push('/login');
    }
  }
};
