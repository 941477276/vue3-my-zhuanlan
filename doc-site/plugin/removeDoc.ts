import { getCodeByTagName } from './fetchCode';
import matter from 'gray-matter';
// @ts-ignore
import MarkdownIt from 'markdown-it';

export function removeDoc () {
  let mt = new MarkdownIt();
  return {
    name: 'removeComponentDocTag',
    transform (code: string, id: string) {
      console.log('id===============', id, id.includes('/demos/'));
      if (id.includes('/demos/') && !id.endsWith('index.vue')) {
        // console.log('code-------------', code);
        let docsContent = getCodeByTagName(code, 'docs', true).trim();
        let matterResult = matter(docsContent);
        let titles = matterResult.data.title || {};
        let descriptions = matterResult.data.description || {};
        console.log(matterResult);
        let templateCode = getCodeByTagName(code, 'template', true);
        let script = getCodeByTagName(code, 'script');
        let style = getCodeByTagName(code, 'style');
        let exampleCode = `
          <template>
            ${templateCode}
          </template>
          ${script}
          ${style}
        `;
        let titleProps = { cn: titles['zh-CN'], en: titles['en-US'] };
        let descriptionProps = { cn: descriptions['zh-CN'], en: descriptions['en-US'] };
        let newCode = `
          <template>
            <demo-box
              :title="${JSON.stringify(titleProps)}"
              :description="${JSON.stringify(descriptionProps)}">
              ${templateCode}
            </demo-box>
          </template>
          ${script}
          ${style}
        `;
        return { code: newCode.trim() };
      }
    }
  };
};
