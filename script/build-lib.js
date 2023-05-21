const path = require('path');
const fs = require('fs');
const { defineConfig, build } = require('vite');
const vue = require('@vitejs/plugin-vue');
const vueJsx = require('@vitejs/plugin-vue-jsx');

// 目标目录路径
const targetDirPath = path.resolve(__dirname, '../lib');
const componentsDirPath = path.resolve(__dirname, '../src/components');

const baseConfig = {
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()]
};
// 外部依赖列表
// const externalList = ['vue', 'dayjs', 'vue3-bootstrap-icon', 'bignumber.js', 'async-validator', '@popperjs/core'];

// 修改作为外部依赖的文件后缀名为.js的rollup插件
const modifyExternalImportFileExtToJs = function () {
  let externalSuffixs = ['.vue', '.ts', '.tsx', '.jsx'];
  return {
    name: 'modify-external-import-file-ext-to-js',
    resolveId: {
      order: 'pre', // 该钩子函数必须提前运行，否则不会执行到
      handler (source, importer, options) {
        // console.log('source: ', source);
        // 将src目录下的所有文件都视为外部依赖
        if ((source.startsWith('./') || source.startsWith('../'))) {
          let result = {
            external: true,
            id: source
          };
          let isExternal = externalSuffixs.some(suffix => source.endsWith(suffix));
          // 修改打包后的文件中的外部依赖导入的后缀名为js，否则在使用时会报错
          if (isExternal) {
            let newSource = source;
            newSource = newSource.replace('.vue', '.js');
            newSource = newSource.replace('.ts', '.js');
            newSource = newSource.replace('.tsx', '.js');
            newSource = newSource.replace('.js', '.js');
            result.id = newSource;
          }
          return result;
        }
      }
    }
  };
};
const rollupOptions = {
  // 确保外部化处理那些你不想打包进库的依赖
  external: ['vue', 'dayjs', 'vue3-bootstrap-icon', 'bignumber.js', 'async-validator', '@popperjs/core'],
  output: {
    globals: {
      vue: 'Vue' // 在 umd / iife 模式 中，将vue作为外部依赖
    }
  },
  plugins: [modifyExternalImportFileExtToJs()]
};

function buildFileToJs (entry, outDir, fileName) {
  build(defineConfig({
    ...baseConfig,
    build: {
      target: 'es2015',
      rollupOptions,
      lib: {
        entry: path.resolve(componentsDirPath, 'bs-select/BsSelect.vue'),
        name: 'BsSelect',
        fileName: 'BsSelect',
        formats: ['es']
      },
      outDir: path.resolve(targetDirPath, 'components/bs-select')
    },
    esbuild: {
      drop: ['console', 'debugger'] // 移除代码中的console
    }
  }));
}

buildFileToJs();
