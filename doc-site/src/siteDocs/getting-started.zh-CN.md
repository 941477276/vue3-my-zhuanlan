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
  import 'bs-vue/es/compoents/bs-button/style'; // 导入的是.scss文件
  import 'bs-vue/es/compoents/bs-dropdown/style'; // 导入的是.scss文件

  export default {
    components: {
      BsButton,
      BsDropdown,
      BsDropdownItem
    },
  };
</script>
```

## 按需加载
### 手动按需导入
如果您未使用任何按需加载插件，您可以通过手动导入的方式来按需加载组件：
```javascript
import BsButton from 'bs-vue/es/components/bs-button';
import 'bs-vue/es/components/bs-button/style'; // 导入的是.scss文件
// 或 import 'bs-vue/es/components/bs-button/style/css'; 导入的是.css文件

import BsForm from 'bs-vue/es/components/bs-form';
import BsFormItem from 'bs-vue/es/components/bs-form/widgets/BsofromItem';
import 'bs-vue/es/components/bs-form/style'; // 导入的是.scss文件
// 或 import 'bs-vue/es/components/bs-form/style/css'; 导入的是.css文件
```

### vite按需导入
如果你使用的 Vite，你可以使用 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 来进行按需加载

1. 首先你需要将下面这段`unplugin-vue-components-resolver`插件代码复制到你的项目中
```typescript
import type { ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components';

export interface BsVueResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'scss'
  /**
   * resolve `vue3-bootstrap-icon' icons
   *
   * requires package `vue3-bootstrap-icon`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * @deprecated use `importStyle: 'css'` instead
   */
  importCss?: boolean
  /**
   * @deprecated use `importStyle: 'scss'` instead
   */
  importScss?: boolean

  /**
   * use commonjs build default false
   */
  cjs?: boolean

  /**
   * rename package
   *
   * @default 'bs-vue'
   */
  packageName?: string
};

interface ChildComponentDirInfo {
  componentDir: string,
  componentNames: string[]
};

// 子组件目录配置列表
const childComponentDirs: ChildComponentDirInfo[] = [
  {
    componentDir: 'bs-breadcrumb',
    componentNames: ['BsBreadcrumbItem']
  },
  {
    componentDir: 'bs-collapse',
    componentNames: ['BsCollapseItem']
  },
  {
    componentDir: 'bs-form',
    componentNames: ['BsFormItem']
  },
  {
    componentDir: 'bs-menu',
    componentNames: ['BsMenuItem', 'BsMenuItemGroup', 'BsSubMenu']
  },
  {
    componentDir: 'bs-table',
    componentNames: []
  },
  {
    componentDir: 'bs-tabs',
    componentNames: ['BsTabPane']
  },
  {
    componentDir: 'bs-select',
    componentNames: ['BsOption', 'BsOptionGroup']
  }
];

/**
 * 获取子组件目录
 * @param componentName
 */
function getChildComponentDir (componentName: string) {
  return childComponentDirs.find(dirInfo => {
    return dirInfo.componentNames.includes(componentName);
  });
}

function kebabCase (camelStr: string): string {
  return camelStr.replace(/(\w)?([A-Z])/g, function (matched, $1, $2) {
    return ($1 ? ($1 + '-') : '') + $2.toLowerCase();
  });
};

function getSideEffects(compName: string, options: BsVueResolverOptions): SideEffectsInfo {
  const {
    importStyle = true,
    importScss = false
  } = options;

  if (!importStyle) {
    return;
  }
  // 不导入图标的样式
  if (options.resolveIcons && compName.startsWith('Bsi')) {
    return;
  }

  const lib = options.cjs ? 'lib' : 'es';
  const packageName = options?.packageName || 'bs-vue';

  let childComponentDir = getChildComponentDir(compName);
  let styleDir = childComponentDir ? childComponentDir.componentDir : kebabCase(compName);
  if (importStyle === 'scss' || importScss) {
    return `${packageName}/${lib}/components/${styleDir}/style`;
  } else {
    return `${packageName}/${lib}/components/${styleDir}/style/css`;
  }
}

/**
 * Resolver for BsVue
 */
export function BsVueResolver(options: BsVueResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { cjs = false, packageName = 'bs-vue' } = options;
      if (options.resolveIcons && name.startsWith('Bsi')) {
        let iconPath = `vue3-bootstrap-icon/${cjs ? 'cjs' : 'es'}/icons/${name}`;
        return {
          name,
          from: iconPath
        };
      }

      if (name.startsWith('Bs') && !name.startsWith('Bsi') && !options?.exclude?.includes(name)) {
        let componentDir = kebabCase(name);
        let childComponentDir = getChildComponentDir(name);
        let path = `${packageName}/${cjs ? 'lib' : 'es'}/components`;
        if (childComponentDir) {
          path += `/${childComponentDir.componentDir}/widgets/${name}`;
        } else {
          path += `/${componentDir}`;
        }

        return {
          name: 'default', // 这里的name为组件文件导出的变量名称
          from: path,
          sideEffects: getSideEffects(name, options)
        };
      }
    }
  };
}
```
2. 在你项目中的`vite.config.js`中使用该插件
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BsVueResolver } from './unplugin-vue-components-resolver';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // 按需加载
    Components({
      dts: true,
      resolvers: [
        BsVueResolver({
          // exclude: ['BsButton'], // 需要排除自动导入的组件
          importStyle: 'scss' // 导入组件的哪种样式文件，可选值：boolean、scss、css。默认导入css样式文件
          // importCss: boolean, // 是否导入组件的css文件
          // importScss: boolean, // 是否导入组件的scss文件
          // resolveIcons: boolean, // 是否自动按需导入`vue3-bootstrap-icon`图标中的图标
          // cjs: boolean, // 是否导入commonjs格式的js文件
          // packageName: string, // 组件库名称，默认为：bs-vue
        })
      ]
    })
  ]
});
```