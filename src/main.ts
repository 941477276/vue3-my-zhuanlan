import { createApp } from 'vue';

import 'bootstrap/scss/bootstrap.scss';
import './scss/index.scss';

import App from './App.vue';
import './icons';
import initBootstrapComponents from '@/components/bootstrap/index.ts';

import router from '@/router';

const app = createApp(App);
// 初始化bootstrap组件
initBootstrapComponents(app);
app.use(router);

app.mount('#app');
