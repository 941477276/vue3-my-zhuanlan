import { createApp } from 'vue';
import App from './App.vue';

// 导入router
import router from './router';
// 导入bootstrap css
import 'bootstrap/scss/bootstrap.scss';
import initBootstrapComponents from '../../src/components/index';

const app = createApp(App);

initBootstrapComponents(app);
app.use(router);

app.mount('#app');
