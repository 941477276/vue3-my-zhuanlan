const path = require('path');
const fs = require('fs');
const { defineConfig, build } = require('vite');
const vue = require('@vitejs/plugin-vue');
const vueJsx = require('@vitejs/plugin-vue-jsx');
const utils = require('./utils');
const os = require('os');

// 目标目录路径
// const targetDirPath = path.resolve(__dirname, '../lib');
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
  let externalSuffixs = ['.vue', '.ts', '.tsx', '.jsx', '.scss'];
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
            if (source.endsWith('.scss')) {
              newSource = newSource.replace('.scss', '.css');
            } else {
              newSource = newSource.replace('.vue', '.js');
              newSource = newSource.replace('.ts', '.js');
              newSource = newSource.replace('.tsx', '.js');
              newSource = newSource.replace('.js', '.js');
            }
            result.id = newSource;
          }
          // console.log('result', result);
          return result;
        }
      }
    }
  };
};

/**
 * 将vue、ts、tsx、js文件转成js
 * @param entry 入口文件
 * @param outDir 输出目录
 * @param fileName 输出的文件名称
 * @param formats 打包后的js的格式，支持es、cjs、amd、iife、umd、system
 */
async function buildVueFileToJs (entry, outDir, fileName, formats = 'es') {
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
  await build(defineConfig({
    configFile: false,
    publicDir: false,
    plugins: [vue(), vueJsx()],
    logLevel: 'warn',
    build: {
      target: 'es2015',
      rollupOptions,
      emptyOutDir: false,
      lib: {
        entry: entry,
        name: fileName,
        fileName: fileName,
        formats: Array.isArray(formats) ? formats : [formats]
      },
      outDir: outDir
    },
    css: {
      postcss: {
        plugins: [
          require('autoprefixer')({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'ie >= 10',
              '> 0.3%'
            ],
            grid: true
          })
        ]
      }
    },
    esbuild: {
      drop: ['console', 'debugger'] // 移除代码中的console
    }
  }));
}

/* buildVueFileToJs(
  path.resolve(__dirname, '../src/components/bs-button/style/bs-button.scss'),
  path.resolve(__dirname, '../es/components/bs-button/style'),
  'bs-button',
  'es'
); */

/**
 * 构建css
 * @param entry
 * @param outDir
 * @param fileName
 * @param formats
 * @returns {Promise<void>}
 */
async function buildCss (entry, outDir, fileName, formats = 'es') {
  await buildVueFileToJs(
    entry,
    outDir,
    fileName,
    formats
  );
  let { dir: entryFileDir } = path.parse(entry);
  // vite构建scss文件后会生成 {fileName}.js、style.css，这里我们需要将{fileName}.js删掉，style.css重命名为{fileName}.scss
  utils.deleteFile(`${outDir}${path.sep}${fileName}.mjs`);
  utils.deleteFile(`${outDir}${path.sep}${fileName}.js`);
  // 重命名style.css为{fileName}.css
  let styleFilePath = `${outDir}${path.sep}style.css`;
  if (fs.existsSync(styleFilePath)) {
    fs.renameSync(`${outDir}${path.sep}style.css`, `${outDir}${path.sep}${fileName}.css`);
  }
  // 复制index.ts到目标目录
  utils.copy(`${entryFileDir}${path.sep}index.ts`, `${outDir}${path.sep}index.ts`);
};

/* buildCss(
  path.resolve(__dirname, '../src/components/bs-button/style/bs-button.scss'),
  path.resolve(__dirname, '../es/components/bs-button/style'),
  'bs-button',
  'es'
); */

async function buildLib (format = 'es') {
  // 用于模式匹配目录文件
  const globby = await import('globby');
  // 获取src目录下除了demos、docs目录下的所有js、vue文件
  const vueFilePaths = globby.globbySync('src/(components|hooks|ts-tokens|utils|styles)/**/*.(vue|tsx|jsx|ts|js|scss)');
  // console.log(vueFilePaths.length);
  // console.log(path.parse('src/components/bs-button/BsButtonUsage.vue'));
  const targetFileParentDir = format == 'cjs' ? 'lib' : 'es';
  console.log('待构建模块数量：', vueFilePaths.length);
  let buildCompletedCount = 0;
  for (let i = 0, len = vueFilePaths.length; i < len; i++) {
    let filePath = vueFilePaths[i];
    let { dir, name, ext } = path.parse(filePath);
    if (name.endsWith('Usage') || name.endsWith('_copy') || dir.includes('/demos') || dir.includes('/docs')) { // 不对使用示例文件、demo、文档进行构建
      buildCompletedCount++;
      continue;
    }
    dir = dir.replace('src/', targetFileParentDir + '/');
    let targetDir = path.resolve(__dirname, `../${dir}`);
    await buildVueFileToJs(
      path.resolve(__dirname, `../${filePath}`),
      targetDir,
      name,
      format
    );
    // console.log('filePath', filePath);
    // 构建组件目录下的scss文件
    if (filePath.includes('/style') && filePath.endsWith('.scss')) {
      await buildCss(
        path.resolve(__dirname, `../${filePath}`),
        targetDir,
        name,
        format
      );
    }
    buildCompletedCount++;
    console.log(`构建进度：${(buildCompletedCount / len * 100).toFixed(2)}%`);
  }
  // 重命名.mjs为.js
  if (format == 'es') {
    let mjsFilePaths = globby.globbySync('es/**/*.mjs');
    console.log('重命名.mjs为.js中...');
    mjsFilePaths.forEach(mjsFilePath => {
      fs.renameSync(mjsFilePath, mjsFilePath.replace('.mjs', '.js'));
    });
    console.log('重命名.mjs为.js完成！');
  }
};

buildLib('cjs');
