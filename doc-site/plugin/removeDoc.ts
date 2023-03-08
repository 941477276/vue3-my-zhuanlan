import { getCodeByTagName } from './fetchCode';

export function removeDoc () {
  return {
    name: 'removeComponentDocTag',
    transform (code: string, id: string) {
      console.log('id===============', id, id.includes('/demos/'));
      if (id.includes('/demos/')) {
        console.log('code-------------', code);
        let template = getCodeByTagName(code, 'template');
        let script = getCodeByTagName(code, 'script');
        let style = getCodeByTagName(code, 'style');
        let newCode = `
          ${template}
          ${script}
          ${style}
        `;
        return { code: newCode.trim() };
      }
    }
  };
};
