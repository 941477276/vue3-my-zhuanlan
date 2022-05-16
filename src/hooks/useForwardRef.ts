import {
  provide,
  Ref,
  InjectionKey
} from 'vue';

export type SetForwardRef = <T>(el: T) => void;

export type ForwardRefContext = {
  setForwardRef: SetForwardRef;
}

export const forwardRefKey: InjectionKey<ForwardRefContext> = Symbol('bsForwardRef');

/**
 * 此hooks作用：子孙组件向父级组件传递dom元素
 */
export function useForwardRef <T> (forwardRef: Ref<T|null>): void {
  // 提供一个函数给子孙组件调用，以设置dom元素进变量
  provide(forwardRefKey, {
    setForwardRef (el: T) {
      forwardRef.value = el;
    }
  });
};

/**
 * 定义更新forward ref的指令，使用了该指令的dom或组件会在dom创建、更新、销毁时及时的更新forward ref
 * @param setForwardRef
 */
export const useForwardRefDirective = (setForwardRef: SetForwardRef) => {
  return {
    mounted (el: HTMLElement) {
      setForwardRef(el);
    },
    updated (el: HTMLElement) {
      // console.log('updated', el);
      setForwardRef(el);
    },
    unmounted (el: HTMLElement) {
      setForwardRef(null);
    }
  };
};
