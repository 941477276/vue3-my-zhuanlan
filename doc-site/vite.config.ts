import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { removeDoc } from './plugin/removeDoc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 9527,
    open: true
  },
  plugins: [
    removeDoc(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    vue()
  ]
});
