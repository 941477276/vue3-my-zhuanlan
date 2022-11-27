const esBuild = require('esbuild');
const esBuildPluginVue = require('esbuild-plugin-vue').default();
const path = require('path');
const esbuildSetExternalPlugin = require('./esbuild-set-external-plugin');
const fs = require('fs');
const utils = require('./utils');
// 构建都目标目录
const targetDir = path.resolve(__dirname, '../lib');
console.log('esBuildPluginVue', esBuildPluginVue);
function build (options = {}) {
  let {
    format,
    outdir,
    useExternalPlugin,
    plugin,
    entryPoints,
    description,
    loader,
    onEnd,
    exclude
  } = options;
  if (!outdir) {
    outdir = targetDir;
  }
  if (typeof useExternalPlugin == 'undefined') {
    useExternalPlugin = true;
  }
  if (!Array.isArray(entryPoints)) {
    entryPoints = [entryPoints];
  }
  if (typeof loader !== 'object' || loader ===  null) {
    loader = {};
  }
  if (!exclude || !Array.isArray(exclude)) {
    exclude = [exclude];
  }
  let extNameIncludes = ['.js', '.ts', '.jsx', '.tsx'];
  let newEntryPoints = [];
  if (description) {
    console.log(`【${description}】构建中...`);
  }
  entryPoints.forEach(entry => {
    if (fs.statSync(entry).isDirectory()) {
      fs.readdirSync(entry).forEach(fileName => {
        let flag = extNameIncludes.some(extName => {
          return fileName.endsWith(extName);
        });
        if (exclude.includes(fileName)) {
          console.log(`【${fileName}】被排除，不进行构建！`);
          return;
        }
        if (!flag) {
          return;
        }
        newEntryPoints.push(path.resolve(entry, fileName));
      });
    } else {
      newEntryPoints.push(entry);
    }
  });

  esBuild.build({
    bundle: true,
    entryPoints: newEntryPoints,
    // outfile: path.resolve(targetDir, 'es/BsiActivity.js'),
    outdir: outdir,
    external: ['vue'],
    loader: {
      '.ts': 'ts',
      '.css': 'copy', // 如遇到css文件直接copy
      ...loader
    },
    format: format,
    drop: ["console", "debugger"], // 移除console、debugger信息
    treeShaking: true,
    // 是否开启自动拆包
    // splitting: true,
    // 是否生成 SourceMap 文件
    // sourcemap: true,
    // 是否生成打包的元信息文件
    // metafile: true,
    // 是否进行代码压缩
    // minify: false,
    // 是否开启 watch 模式，在 watch 模式下代码变动则会触发重新打包
    // watch: false,
    // 是否将产物写入磁盘
    // write: true,
    // watch: true,
    // bundle: true,
    // minify: true,
    plugins: [
      ...(plugin ? [plugin] : []),
      esBuildPluginVue,
      {
        name: 'on-build-end-plugin',
        setup (build) {
          build.onEnd(result => {
            console.log(`build ended with ${result.errors.length} errors`);
            if (typeof onEnd == 'function') {
              onEnd(result);
            }
          });
        }
      }
    ]
  });
  if (description) {
    console.log(`【${description}】构建完成...`);
  }
}

// 构建 /src/components 目录下的组件
build({
  format: 'esm',
  description: 'components组件',
  outdir: path.resolve(targetDir, 'es/components'),
  useExternalPlugin: true,
  entryPoints: path.resolve(__dirname, '../src/components'),
  plugin: esbuildSetExternalPlugin(function (path, namespace) {
    // console.log('path', path);
    // console.log(namespace);
    // 所有从 components 目录中导入的模块都视为external(除css外)
    return namespace.importer.includes('/components/') && !path.endsWith('.css') && namespace.kind === 'import-statement';
  })
});

// 构建图标目录下的组件
build({
  format: 'esm',
  description: 'icon图标组件',
  outdir: path.resolve(targetDir, 'es/icons'),
  useExternalPlugin: true,
  exclude: ['index.ts'], // index.ts不进行构建，直接复制并改后缀名为 .js 即可
  entryPoints: path.resolve(__dirname, '../src/icons'),
  plugin: esbuildSetExternalPlugin(function (path, namespace) {
    // 所有从 components 目录中导入的模块都视为external(除css外)
    return (path.includes('/components/') || namespace.importer.includes('/components/')) && namespace.kind === 'import-statement';
  }),
  onEnd () {
    // 将 /src/icons/index.ts 复制到 /lib/es/icons/index.js
    utils.copy(path.resolve(__dirname, '../src/icons/index.ts'), path.resolve(targetDir, 'es/icons/index.js'));
  }
});
