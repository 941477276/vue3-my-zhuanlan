/**
 * 构建文档路由
 * */
const fs = require('fs');
const path = require('path');
// 从字符串或文件解析front-matter。快速、可靠、使用方便。默认情况下解析YAML前端内容
const matter = require('gray-matter');

// 菜单分类排序
const menuCategoryOrder = [
  { title: '通用', code: 'generic' },
  { title: '数据录入', code: 'data_input' },
  { title: '导航', code: 'navigation' },
  { title: '数据展示', code: 'data_display' },
  { title: '反馈', code: 'feedback' },
  { title: '工具组件', code: 'tool_component' },
  { title: '其他', code: 'other' }
];
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
    let typeCode = matterData.typeCode;
    if (!menus[typeCode]) { // 按分类存储菜单
      menus[typeCode] = {
        typeName: matterData.type,
        typeCode: typeCode,
        children: []
      };
    }
    menus[typeCode].children.push({
      type: matterData.type,
      typeCode: typeCode,
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

  fs.writeFileSync(path.resolve(__dirname, '../src/router/docRoutes.ts'), template, 'utf-8');

  // 生成菜单
  Object.entries(langMenusMap).forEach(entry => {
    let fileName = `menu.${entry[0]}.ts`;
    let menus = Object.entries(entry[1]);
    // 对菜单进行排序
    let newMenus = menuCategoryOrder.map((categoryItem, index) => {
      let categoryCode = categoryItem.code;
      let categoryIndex = menus.findIndex(entry => entry[0] === categoryCode);
      return menus[categoryIndex];
    });
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
newMenus.map(menuEntry => {
  return `{
    type: '${menuEntry[1].typeName}',
    typeCode: '${menuEntry[0]}',
    children: ${JSON.stringify(menuEntry[1].children)}
  }`;
}).join(',')
}
];

export default menus;
    `;
    fs.writeFileSync(path.resolve(__dirname, `../src/router/${fileName}`), menuContent.trim(), 'utf-8');
  });

  console.log('----构建文档路由 end----');
})();
