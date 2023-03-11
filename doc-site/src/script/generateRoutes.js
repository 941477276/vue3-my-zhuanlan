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

  // 菜单集合
  let langMenusMap = {};

  // 组件文档内容
  const componentDocs = mdPaths.reduce(function (result, mdPath) {
    let componentName = mdPath.split('/')[2].replace(/^bs-/, '');
    let mdFileName = path.parse(mdPath).name; // 取到的文件名是不带后缀名的
    let lang = mdFileName.split('.');
    lang = lang[lang.length - 1];
    let matterResult = matter.read(mdPath);
    let matterData = matterResult.data;
    result[componentName] = {
      markdownString: matterResult.content,
      matter: matterData,
      lang
    };

    if (!langMenusMap[lang]) {
      langMenusMap[lang] = {};
    }
    let menus = langMenusMap[lang];
    if (!menus[matterData.type]) { // 按分类存储菜单
      menus[matterData.type] = [];
    }
    menus[matterData.type].push({
      // type: matterData.type,
      title: matterData.title,
      subtitle: matterData.subtitle,
      componentName
    });

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
      name: '${componentName}',
      meta: ${JSON.stringify(componentDocs[componentName].matter)},
      component: () => import('../../../src/components/bs-${componentName}/demos/index.vue')
    }`);
  }).join(',')}
];`;

  fs.writeFileSync(path.resolve(__dirname, '../router/docRoutes.ts'), template, 'utf-8');

  // 生成菜单
  Object.entries(langMenusMap).forEach(entry => {
    let fileName = `menu.${entry[0]}.ts`;
    let menuContent = `
// 由 generateRoutes.js 自动构建的菜单文件
export interface MenuItem {
  title: string;
  subtitle?: string;
  componentName: string;
};

export interface Menus {
  type: string;
  children: MenuItem[];
}

/* eslint-disable */
let menus: Menus[] = [
${
Object.entries(entry[1]).map(menuEntry => {
  return `{
    type: '${menuEntry[0]}',
    children: ${JSON.stringify(menuEntry[1])}
  }`;
}).join(',')
}
];

export default menus;
    `;
    fs.writeFileSync(path.resolve(__dirname, `../router/${fileName}`), menuContent.trim(), 'utf-8');
  });

  console.log('----构建文档路由 end----');
})();
