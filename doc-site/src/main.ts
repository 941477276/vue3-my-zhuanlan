import { createApp } from 'vue';
import App from './App.vue';

// 导入router
import router from './router';
// 导入bootstrap css
import 'bootstrap/scss/bootstrap.scss';
// 导入代码高亮插件css
import 'prism-themes/themes/prism-atom-dark.css';
import initBootstrapComponents from '../../src/components/index';

// 导入全局组件
import DemoBox from './components/DemoBox.vue';
import ComponentDoc from './components/ComponentDoc.vue';

const app = createApp(App);

initBootstrapComponents(app);
app.component(DemoBox.name, DemoBox);
app.component(ComponentDoc.name, ComponentDoc);
app.use(router);

app.mount('#app');
