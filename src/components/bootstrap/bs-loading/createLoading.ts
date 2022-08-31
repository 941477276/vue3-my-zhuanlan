import {
  Ref,
  VNode,
  reactive,
  createVNode,
  render
} from 'vue';
import BsLoading from './BsLoading.vue';
import { useGetContentInfo } from '@/hooks/useGetContentInfo';
import { CreateLoadingOptions } from '@/ts-tokens/bootstrap/loading';

let loadingCount = 0;
export function createLoading (options: CreateLoadingOptions = {} as (CreateLoadingOptions)) {
  let optionsCopy = {
    ...options
  };
  // let target = options.target;
  delete optionsCopy.spinnerRender;
  delete optionsCopy.textRender;
  // delete optionsCopy.target;
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

  let loadingId = `bs-loading_${++loadingCount}`;
  let vm = createVNode(BsLoading, configs, slotContent);
  render(vm, container);

  return {
    id: loadingId,
    setVisible (flag: boolean) {
      configs.visible = !!flag;
    },
    vm
  };
};
