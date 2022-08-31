import {
  isString,
  isObject
} from '@vue/shared';
import { createLoading } from './createLoading';
import { CreateLoadingOptions } from '@/ts-tokens/bootstrap/loading';

interface BsLoadingOptions extends CreateLoadingOptions {
  target?: string|HTMLElement; // Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串
  fullscreen?: boolean;
};

export function BsLoading (options: BsLoadingOptions = {} as BsLoadingOptions) {
  let container: HTMLElement|null = null;
  let { target, fullscreen } = options;
  let newOptions = { ...options };
  delete newOptions.target;
  console.log('target', target);
  if (isString(target)) {
    container = document.querySelector(target);
  } else if (target && isObject(target) && target.nodeType == 1) {
    container = target;
  }
  if (!container) {
    console.warn('BsLoading, "options.target" is not a dom!');
    return;
  }
  let loadingIns = createLoading(newOptions);
  container.appendChild(loadingIns.vm.el as HTMLElement);

  return {
    show () {
      loadingIns.setVisible(true);
    },
    hide () {
      loadingIns.setVisible(false);
    }
  };
}
