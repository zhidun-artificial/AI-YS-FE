import { defineConfig, RuntimeConfig } from '@umijs/max';
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
  publicPath: process.env.NODE_ENV === 'development' ? '/' : `/${process.env.BASE_URL}/`,
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
  routes,
  define: {
    'process.env.API_ID': process.env.API_ID,
    'process.env.BASE_URL': process.env.NODE_ENV === 'development' ? '' : process.env.BASE_URL,
    'process.env.BUILD_TIME': new Date().getTime(),
  },
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  tailwindcss: {},
});
