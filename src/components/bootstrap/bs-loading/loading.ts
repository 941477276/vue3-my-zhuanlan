import {
  isString,
  isObject,
  isFunction
} from '@vue/shared';
import { createLoadingComponent, LoadingInstance } from './createLoadingComponent';
import { CreateLoadingOptions } from '@/ts-tokens/bootstrap/loading';
import {
  getStyle
} from '@/common/bs-util';
import { useLockScroll } from '@/hooks/useLockScroll';
import { bsLoadingProps } from './bs-loading-props';

let fullscreenLoading: any = null;

export interface BsLoadingOptions extends CreateLoadingOptions {
  target?: string|HTMLElement; // Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串
  fullscreen?: boolean;
  lock?: boolean;
};

export function BsLoading (options: BsLoadingOptions = {} as BsLoadingOptions) {
  let { target, fullscreen, lock } = options;

  if (fullscreen && fullscreenLoading) {
    console.log('返回缓存的全局loading实例');
    return fullscreenLoading;
  }

  let container: HTMLElement|null = null;
  let containerOriginStylePosition = ''; // 包裹loading父级元素的position值
  let unlockScroll: any;
  let newOptions: any = {
    onDestroy () {
      console.log('执行了onDestroy');
      if (fullscreen) {
        fullscreenLoading = null;
      }
    },
    onHide () {
      console.log('执行了onHide');
      if (container && !fullscreen) {
        container.style.position = containerOriginStylePosition;
      }
      if (isFunction(options.onHide)) {
        options.onHide();
      }
      if (isFunction(unlockScroll)) {
        // console.log('isFunction unlockScroll');
        unlockScroll();
        unlockScroll = null;
      }
    }
  };
  for (let attr in bsLoadingProps) {
    newOptions[attr] = (options as any)[attr];
  }
  // console.log('target', target);
  if (fullscreen) {
    container = document.body;
  } else {
    if (isString(target)) {
      container = document.querySelector(target);
    } else if (target && isObject(target) && target.nodeType == 1) {
      container = target;
    }
  }
  if (!container) {
    console.warn('BsLoading, "options.target" is not a dom!');
    return;
  }
  let loadingIns = createLoadingComponent(newOptions);
  container.appendChild(loadingIns.vm.el as HTMLElement);

  let updateProps = function (newProps: any) {
    let visible = newProps.visible;
    if (!container) {
      return;
    }
    if ('lock' in newProps) {
      lock = newProps.lock;
    }
    if (typeof lock !== 'boolean' && fullscreen) {
      lock = true;
    }
    if (typeof visible == 'boolean') {
      let containerIsBody = container.nodeName == 'BODY';
      if (visible) {
        if (!fullscreen && !containerIsBody) { // 设置包裹loading的父级元素的定位
          let isStaticPosition = getStyle(container, 'position') == 'static';
          containerOriginStylePosition = container.style.position || '';
          if (isStaticPosition) {
            container.style.position = 'relative';
          }
        }
        if (lock) {
          // 锁定包裹loading父级元素的滚动条
          if (fullscreen || containerIsBody) {
            unlockScroll = useLockScroll();
          } else {
            let containerOriginStyleOverflow = container.style.overflow;
            let isLocked = getStyle(container, 'overflow') == 'hidden';
            if (!isLocked) {
              container.style.overflow = 'hidden';
              unlockScroll = function () {
                if (!container) {
                  return;
                }
                container.style.overflow = containerOriginStyleOverflow;
              };
            }
          }
        }
      }
    };
    loadingIns.updateProps(newProps);
  };

  let returnResult = {
    updateProps,
    destroy () {
      loadingIns.destroy();
      container = null;
      if (fullscreen) {
        fullscreenLoading = null;
      }
    },
    show () {
      updateProps({
        visible: true
      });
    },
    hide () {
      updateProps({
        visible: false
      });
    }
  };

  if (fullscreen) {
    fullscreenLoading = returnResult;
  }

  return returnResult;
}
