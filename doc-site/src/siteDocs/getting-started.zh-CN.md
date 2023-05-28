# 快速上手
本节将介绍如何在项目中使用 Bootstrap Vue。

## 引入 Bootstrap Vue

### 安装
1. 使用`npm`安装
```bash
npm install bs-vue -S
```

## 注册
如果使用 Vue 默认的模板语法，需要注册组件后方可使用，有如下三种方式注册组件：
### 全局完整注册
```js
import { createApp } from 'vue';
import App from './App';
// 导入bs-vue
import BsVue from 'bs-vue';
// 导入bs-vue组件样式
// import 'bs-vue/es/components/index.js'; // 导入的是.scss文件
import 'bs-vue/es/components/css.js'; // 导入的是.css文件
// 导入除bootstrap组件样式外的其他样式（如果您需要的话），如栅格系统、导航栏、卡片、布局等
// import 'bs-vue/es/styles/bootstrap-other.scss';
import 'bs-vue/es/styles/bootstrap-other.css';

const app = createApp(App);

app.use(BsVue).mount('#app');
```

### 全局部分注册
```javascript
import { createApp } from 'vue';
import { BsButton, BsInput, BsDropdown, BsMessage } from 'bs-vue';
/** 导入组件样式方式1：手动按需导入
 * // 如果您未使用按需导入插件，那么您需要手动导入组件的样式
 * import 'bs-vue/es/components/bs-button/style/index.js'; // 组件style目录下的index.js文件为导入的是.scss文件
 * // import 'bs-vue/es/components/bs-button/style/css.js'; // 组件style目录下的index.js文件为导入的是.css文件
 */

/** 导入组件样式方式2：一次性导入所有组件样式
 * import 'bs-vue/es/compoents/style.js'; // 导入的是.scss文件
 * // import 'bs-vue/es/compoents/css.js'; // 导入的是.css文件
 */
import 'bs-vue/es/compoents/style.js'; // 导入的是.scss文件
// import 'bs-vue/es/compoents/css.js'; // 导入的是.css文件

import App from './App';

const app = createApp(App);
app.use(BsButton);
app.use(BsInput);
/* 会自动注册 Dropdown 下的子组件, 例如 BsDropdownItem */
app.use(BsDropdown);
  
app.mount('#app');

app.config.globalProperties.$message = BsMessage;
```

### 组件级局部注册
此种方式需要分别注册组件子组件，如 BsDropdown、BsDropdownItem，并且注册后仅在当前组件中有效。所以我们推荐使用上述两种方式。
```html
<template>
  <bs-button>Add</bs-button>
</template>
<script>
  import { BsButton, BsDropdown, BsDropdownItem } from 'bs-vue';

  export default {
    components: {
      BsButton,
      BsDropdown,
      BsDropdownItem
    },
  };
</script>
```
