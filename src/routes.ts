import type { defineConfig } from '@umijs/max';

type routeType = ReturnType<typeof defineConfig>['routes'];

export const managementPath = '/management';
export const managementName = '管理';
export const systemPath = '/statistics';
export const systemName = '资源统计';

const routes: routeType = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    name: '注册',
    path: '/register',
    component: './Login/register',
    layout: false,
  },
  {
    name: '会话',
    path: '/home',
    component: '@/pages/Home/index.tsx',
    icon: 'local:chat',
    menu: {
      category: 'function',
      categoryName: '功能',
      sort: 1,
    },
  },
  {
    name: '对话',
    path: '/chat/:id',
    component: '@/pages/Chat/$id.tsx',
    menu: {
      category: 'function',
      categoryName: '功能',
      hidden: true,
    },
  },
  {
    name: '新建对话',
    path: '/new/:id',
    component: '@/pages/New/$id.tsx',
    menu: {
      category: 'function',
      categoryName: '功能',
      hidden: true,
    },
  },
  {
    name: '知识库',
    path: '/knowledge',
    icon: 'local:knowledge', // 自定义图标
    menu: {
      category: 'function',
      categoryName: '功能',
      sort: 4,
    },
    routes: [
      {
        name: '知识库',
        path: '/knowledge/library',
        component: '@/pages/Knowledge',
      },
      {
        name: '知识库管理',
        path: '/knowledge/setting',
        component: '@/pages/Knowledge/management.tsx',
      },
    ],
  },
  {
    name: '文献搜索',
    path: '/search',
    component: '@/pages/Search',
    icon: 'local:search', // 自定义图标
    menu: {
      category: 'function',
      categoryName: '功能',
      sort: 5,
    },
  },
  {
    name: '团队管理',
    path: '/team',
    component: '@/pages/Team',
    icon: 'local:team', // 自定义图标
    menu: {
      category: 'system',
      categoryName: '系统',
      sort: 1,
    },
  },
  {
    name: managementName, // 管理
    path: managementPath,
    icon: 'local:setting',
    menu: {
      category: 'system',
      categoryName: '系统',
      sort: 2,
    },
    routes: [
      {
        name: '系统设置',
        path: '/management/system',
        component: '@/pages/Management/System.tsx',
      },
      {
        name: '模型管理',
        path: '/management/models',
        component: '@/pages/Management/Models.tsx',
      },
      {
        name: '屏蔽词管理',
        path: '/management/sensitive',
        component: '@/pages/Management/Sensitive.tsx',
      },
    ],
  },
  {
    name: systemName, // 管理
    path: systemPath,
    icon: 'local:setting',
    menu: {
      category: 'system',
      categoryName: '系统',
      sort: 3,
    },
    routes: [
      {
        name: '知识库统计',
        path: '/statistics/repository',
        component: '@/pages/System/Repository.tsx',
      },
      {
        name: '资源统计',
        path: '/statistics/resource',
        component: '@/pages/System/Resource.tsx',
      },
    ],
  },
  {
    name: '示例',
    path: '/demo',
    component: '@/pages/Demo',
    icon: 'local:team', // 自定义图标
    menu: {
      category: 'system',
      categoryName: '系统',
      sort: 3,
      hidden: true,
    },
  },
];

export default routes;
