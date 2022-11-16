import {
  ref
} from 'vue';
import {
  isPromise
} from '@/common/bs-util';

/**
 * 处理message box显示或隐藏
 */

export function useVisible (props: any) {
  let visible = ref(false);

  let show = function () {
    visible.value = true;
  };
  let hide = function () {
    let okCloseResult = typeof props.onCancel === 'function' ? props.onCancel() : true;
    if (okCloseResult === false) {
      return;
    }
    if (isPromise(okCloseResult)) {
      okCloseResult.then(() => {
        visible.value = false;
        console.log('关闭message box！');
      });
    } else {
      visible.value = false;
      console.log('关闭message box！');
    }
  };
  return {
    visible,

    show,
    hide
  };
};
