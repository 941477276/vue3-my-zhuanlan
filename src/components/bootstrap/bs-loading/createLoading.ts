import {
  Ref,
  VNode,
  reactive,
  createVNode,
  render
} from 'vue';
import {
  isString,
  isObject
} from '@vue/shared';
import BsLoading from './BsLoading.vue';
import { useGetContentInfo } from '@/hooks/useGetContentInfo';

interface CreateLoadingOptions {
  // visible: Ref<boolean>,
  text: Ref<string|number>|string|number;
  target?: any; // Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串
  grow?: Ref<boolean>|boolean;
  vertical?: Ref<boolean>|boolean;
  color?: Ref<string>|string;
  background?: Ref<string>|string;
  transitionName?: Ref<string>|string;
  spinnerRender?: VNode|(() => VNode); // 自定义渲染spinner函数
  textRender?: VNode|(() => VNode); // 自定义渲染内容函数
};

export function createLoading (options: CreateLoadingOptions = {} as (CreateLoadingOptions)) {
  let optionsCopy = {
    ...options
  };
  let target = options.target;
  delete optionsCopy.spinnerRender;
  delete optionsCopy.textRender;
  delete optionsCopy.target;
  let configs = reactive({
    ...optionsCopy,
    visible: false
  });
  let contentSlot = useGetContentInfo(options.textRender);
  let spinnerSlot = useGetContentInfo(options.spinnerRender);
  let slotContent: any = {};
  if (contentSlot.text) {
    slotContent.default = function () {
      return contentSlot.text;
    };
  } else if (contentSlot.slotContent) {
    slotContent.default = contentSlot.slotContent;
  }

  if (spinnerSlot.text) {
    slotContent.spinner = function () {
      return spinnerSlot.text;
    };
  } else if (spinnerSlot.slotContent) {
    slotContent.spinner = spinnerSlot.slotContent;
  }
  let container = document.createElement('div');
  /* if (isString(target)) {
    container = document.querySelector(target);
  } else if (target && isObject(target) && target.nodeType == 1) {
    container = target as HTMLElement;
  } */

  let vm = createVNode(BsLoading, configs, slotContent);
  render(vm, container);

  return {
    vm
  };
};
