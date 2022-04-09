import { createApp } from 'vue';

import 'bootstrap/scss/bootstrap.scss';
import './scss/index.scss';

import App from './App.vue';
import './icons';
import initBootstrapComponents from '@/components/bootstrap/index.ts';

import store from '@/store';
import router from '@/router';
import initRouterDefend from '@/router/routerDefend';

const app = createApp(App);
// 初始化bootstrap组件
initBootstrapComponents(app);
initRouterDefend(router);
app.use(store);
app.use(router);

app.mount('#app');
