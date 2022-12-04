import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/scss/bootstrap.scss';
import router from '@/router';

const app = createApp(App);
app.use(router);
app.mount('#app');
