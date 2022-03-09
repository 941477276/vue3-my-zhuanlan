import { createApp } from 'vue';

import 'bootstrap/scss/bootstrap.scss';
import './scss/index.scss';

import App from './App.vue';
import initBootstrapComponents from '@/components/bootstrap/index.ts';

const app = createApp(App);
// 初始化bootstrap组件
initBootstrapComponents(app);

app.mount('#app');
