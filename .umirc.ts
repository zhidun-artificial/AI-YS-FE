import { defineConfig } from '@umijs/max';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import routes from './src/routes';

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
  targets: {
    chrome: 69,
    // 如果需要支持其他浏览器也可以添加
    firefox: 51,
  },
  legacy: {
    buildOnly: false
  },
  polyfill: {
    imports: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      // path.resolve(__dirname, 'src/polyfills/text-encode-transform.js')
    ]
  },
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
  antd: {
    theme: {
      token: {
        colorPrimary: '#4F46E5',
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  icons: {
    autoInstall: {},
  },
  request: {},
  layout: false,
  routes,
  define: {
    'process.env.API_ID': process.env.API_ID,
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.BASE_URL': process.env.NODE_ENV === 'development' ? '' : process.env.BASE_URL,
    'process.env.BUILD_TIME': new Date().getTime(),
  },
  proxy: {
    '/cas': {
      target: 'http://113.108.105.54:56800',
      changeOrigin: false,
      // secure: false,
      // onProxyRes: (proxyRes, req, res) => {
      //   console.log('res', res);
      //   // Handle redirects from the CAS server
      // },
      // changeOrigin: true,
      // pathRewrite: { '^/cas/login': '/cas/login' }, // Uncomment if path rewriting is needed
    },
  },
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
});
