# 快速上手
本节将介绍如何在项目中使用 Bootstrap View。

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
import BsVue from 'bootstrap-vue';
import App from './App';
import 'bootstrap-vue/dist/index.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

### 全局部分注册
```javascript
import { createApp } from 'vue';
import { BsButton, BsInput, BsDropdown, BsMessage } from 'bootstrap-vue';
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
  import { BsButton, BsDropdown, BsDropdownItem } from 'bootstrap-vue';

  export default {
    components: {
      BsButton,
      BsDropdown,
      BsDropdownItem
    },
  };
</script>
```
