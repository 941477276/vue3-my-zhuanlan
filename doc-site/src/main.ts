import { createApp } from 'vue';
import App from './App.vue';

// 导入router
import router from './router';
// 导入bootstrap css
import 'bootstrap/scss/bootstrap.scss';

const app = createApp(App);

app.use(router);

app.mount('#app');
