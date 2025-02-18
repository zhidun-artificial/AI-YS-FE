import { defineConfig } from '@umijs/max';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

// 配置pdf-dist
const cMapsDir = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'cmaps',
);
const standardFontsDir = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts',
);

export default defineConfig({
  publicPath:
    process.env.NODE_ENV === 'development' ? '/' : `/${process.env.BASE_URL}/`,
  history: { type: 'hash' },
  chainWebpack(config) {
    config.plugin('copy').use(CopyWebpackPlugin, [
      {
        patterns: [
          { from: cMapsDir, to: 'cmaps/' },
          { from: standardFontsDir, to: 'standard_fonts/' },
          { from: path.resolve(__dirname, 'public'), to: '' },
        ],
      },
    ]);
  },
  favicons: ['favicon.ico'],
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  routes: [
    {
      path: '/',
      redirect: '/login',
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
      name: '首页',
      path: '/home',
      component: '@/pages/Home/index.tsx',
      access: 'canAccessHome',
    },
    {
      name: '对话',
      path: '/chat/:id',
      component: '@/pages/Chat/$id.tsx',
      access: 'canAccessChat',
    },
    {
      name: '文库',
      path: '/document',
      component: '@/pages/Document',
      access: 'canAccessDocument',
    },
    {
      name: '系统管理',
      path: '/setting',
      hideChildrenInMenu: true,
      access: 'canAccessSetting',
      routes: [
        {
          name: '文库管理',
          path: '/setting/doc',
          component: '@/pages/Setting/Doc.tsx',
          access: 'canAccessDoc',
        },
        {
          name: '文库详情',
          path: '/setting/doc/:DocDetail',
          component: '@/pages/Setting/$DocDetail.tsx',
          access: 'canAccessDocDetail',
          notShowInMenu: true,
        },
        {
          name: '角色管理',
          path: '/setting/role',
          component: '@/pages/Setting/Role.tsx',
          access: 'canAccessRole',
        },
        {
          name: '用户管理',
          path: '/setting/user',
          component: '@/pages/Setting/User.tsx',
          access: 'canAccessUser',
        },
        {
          name: '屏蔽词管理',
          path: '/setting/sensitive',
          component: '@/pages/Setting/Sensitive.tsx',
          access: 'canAccessSensitive',
        },
        {
          name: '审计日志',
          path: '/setting/log',
          component: '@/pages/Setting/Log.tsx',
          access: 'canAccessLog',
        },
        // {
        //   name: '系统设置',
        //   path: '/setting/system',
        //   component: '@/pages/Setting/System.tsx',
        //   access: 'canAccessSystem',
        // },
      ],
    },
    {
      name: '新建对话',
      path: '/new/:id',
      component: '@/pages/New/$id.tsx',
      access: 'canAccessNew',
    },
    // {
    //   name: '历史对话',
    //   path: '/history',
    //   icon: './icons/history-select.svg',
    //   component: '@/pages/Chat/$id.tsx',
    // },
  ],
  define: {
    'process.env.API_ID': process.env.API_ID,
    'process.env.BASE_URL':
      process.env.NODE_ENV === 'development' ? '' : process.env.BASE_URL,
  },
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
});
