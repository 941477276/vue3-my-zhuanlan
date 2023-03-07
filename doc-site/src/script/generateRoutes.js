/**
 * 构建文档路由
 * */
const fs = require('fs');
const path = require('path');
// 从字符串或文件解析front-matter。快速、可靠、使用方便。默认情况下解析YAML前端内容
const matter = require('gray-matter');

;(async function () {
  console.log('----构建文档路由 start----');
  // 用于模式匹配目录文件
  const globby = await import('globby');
  // 获取所有组件文档md文件路径
  const mdPaths = globby.globbySync('src/components/*/docs/index.*.md');
  // console.log(mdPaths);

  // 组件文档内容
  const componentDocs = mdPaths.reduce(function (result, mdPath) {
    let componentName = mdPath.split('/')[2].replace(/^bs-/, '');
    let mdFileName = path.parse(mdPath).name; // 取到的文件名是不带后缀名的
    let lang = mdFileName.split('.');
    lang = lang[lang.length - 1];
    let matterResult = matter.read(mdPath);
    result[componentName] = {
      markdownString: matterResult.content,
      matter: matterResult.data,
      lang
    };
    return result;
  }, {});

  let template = `
// 由 generateRoutes.js 自动构建的路由文件
/* eslint-disable */
export default [
  ${Object.keys(componentDocs).map(componentName => {
    return (`
    {
      path: '${componentName}',
      meta: ${JSON.stringify(componentDocs[componentName].matter)},
      component: () => import('../../../src/components/bs-${componentName}/demos/index.vue')
    }`);
  }).join(',')}
];`;
  fs.writeFileSync(path.resolve(__dirname, '../router/docRoutes.ts'), template, 'utf-8');
  console.log('----构建文档路由 end----');
})();
