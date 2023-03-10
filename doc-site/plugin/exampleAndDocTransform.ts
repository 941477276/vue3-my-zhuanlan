import { getCodeByTagName } from './fetchCode';
import matter from 'gray-matter';
// @ts-ignore
import MarkdownIt from 'markdown-it';
// @ts-ignore
import path from 'path';

let caches: Record<string, [number, string, string]> = {}; // 缓存代码
let deleteCache = function (now: number) {
  for (let id in caches) {
    if (now - caches[id][0] >= 60000) {
      console.log(`[移除缓存]组件缓存超过1分钟未使用！组件ID：${id}`);
      delete caches[id];
    }
  }
};
// 获取组件名称的正则
const componentNameReg = /components\/([a-z0-9A-Z_\-]+)\/demos/;

export function exampleAndDocTransform () {
  let mt = new MarkdownIt();
  console.log('removeDoc插件启动了');
  return {
    name: 'exampleAndDocTransform',
    transform (code: string, id: string) {
      // console.log('id===============', id, id.includes('/demos/'));
      let now = new Date().getTime();
      if (id.includes('/demos/') && !id.endsWith('index.vue')) {
        // console.log('code-------------', code);
        if (id in caches) {
          let [recentlyTime, originCode, resultCode] = caches[id];
          // 如果缓存的代码与当前代码一致，则使用缓存里的代码
          if (code === originCode) {
            caches[id][0] = now;
            console.log(`[使用缓存中的组件]，组件ID：${id}`);
            deleteCache(now);
            return resultCode;
          }
        }
        let docsContent = getCodeByTagName(code, 'docs', true).trim();
        let matterResult = matter(docsContent);
        let titles = matterResult.data.title || {};
        let descriptions = matterResult.data.description || {};
        let descCN = descriptions['zh-CN'] ? mt.render(descriptions['zh-CN']) : '';
        let descEN = descriptions['zh-EN'] ? mt.render(descriptions['zh-EN']) : '';

        let templateCode = getCodeByTagName(code, 'template', true).trim();
        let script = getCodeByTagName(code, 'script');
        let style = getCodeByTagName(code, 'style');

        // 示例代码
        let exampleCode =
`<template>
  ${templateCode}
</template>
${script}
${style}`.trim();
        // 将示例代码进行uri编码下，未编码的代码在编译时会报错
        exampleCode = encodeURIComponent(exampleCode);

        let fileName = path.parse(id).name; // 取到的文件名是不带后缀名的
        let componentName = id.match(componentNameReg)![1];
        componentName = componentName.replace('bs-', '');
        let domId = componentName + '_' + fileName;
        // 新代码
        let newCode = `
          <template>
            <demo-box
              id="${domId}"
              :title="{cn: '${titles['zh-CN']}', en: '${titles['en-US']}' }"
              :description="{cn: '${encodeURIComponent(descCN)}', en: '${encodeURIComponent(descEN)}' }"
              example-code="${exampleCode}">
              ${templateCode}
            </demo-box>
          </template>
          ${script}
          ${style}
        `;
        // 缓存代码
        caches[id] = [now, code, newCode.trim()];
        deleteCache(now);
        return { code: newCode.trim() };
      }
      deleteCache(now);
    }
  };
};
