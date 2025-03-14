import type { defineConfig } from "@umijs/max";

type routeType = ReturnType<typeof defineConfig>['routes'];


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
    menu: {
      category: 'function',
      sort: 1
    }
  },
  {
    name: '对话',
    path: '/chat/:id',
    component: '@/pages/Chat/$id.tsx',
    menu: {
      category: 'function',
      hidden: true,
    }
  },
  {
    name: '新建对话',
    path: '/new/:id',
    component: '@/pages/New/$id.tsx',
    menu: {
      category: 'function',
      hidden: true,
    }
  },
  {
    name: '知识库',
    path: '/knowledge',
    component: '@/pages/Knowledge',
    menu: {
      category: 'function',
      sort: 4
    }
  },
  {
    name: '搜索',
    path: '/search',
    component: '@/pages/Search',
    menu: {
      category: 'system',
      sort: 1
    }
  },
  {
    name: '管理',
    path: '/management',
    menu: {
      category: 'system',
      sort: 2
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
      }
    ],
  },
  {
    name: '团队管理',
    path: '/team',
    component: '@/pages/Team',
    menu: {
      category: 'system',
      sort: 1
    }
  },
]

export default routes