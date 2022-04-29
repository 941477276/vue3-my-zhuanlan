import { isVNode, VNode } from 'vue';

/**
 * 根据参数获取文本或slot内容
 * @param option
 */
export function useGetContentInfo (option: string|VNode|unknown) {
  let text;
  let slotContent;
  let optionsType = typeof option;
  if (optionsType === 'string' || optionsType === 'number' || optionsType === 'undefined' || optionsType === null) {
    text = option;
  } else if (isVNode(option)) {
    // console.log('是vnode', options);
    slotContent = {
      default: () => option
    };
  } else if (optionsType === 'function') {
    slotContent = { default: option };
  }
  return {
    text,
    slotContent
  };
};
