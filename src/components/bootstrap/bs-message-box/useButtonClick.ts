import {
  Component,
  computed,
  Ref,
  ref,
  isRef
} from 'vue';
import {
  isPromise
} from '@/common/bs-util';

/**
 * 处理确定、取消按钮的点击事件
 */
export function useButtonClick (props: any, formItemRef: Ref<Component|null>, hideFn: () => any) {
  let okPromiseResolve = ref(false);
  let okLoadingInner = computed(function () {
    let okLoadingProp = props.okLoading;
    if (isRef(okLoadingProp)) {
      if (okLoadingProp.value) {
        return true;
      }
    } else if (okLoadingProp) {
      return true;
    }
    return okPromiseResolve.value;
  });
  let inputModelVal = ref(props.inputValue);

  let okClick = function () {
    if (props.okDisabled) {
      return;
    }
    let doClose = function () {
      let okCbResult = typeof props.onOk === 'function' ? props.onOk(hideFn, props.type === 'prompt' ? inputModelVal.value : undefined) : true;
      if (okCbResult === false) {
        return;
      }
      // 如果确定按钮的回调执行后的返回为promise，则等promise状态为fulfilled后再关闭
      if (isPromise(okCbResult)) {
        okPromiseResolve.value = true;
        okCbResult.then(() => {
          okPromiseResolve.value = false;
          if (!props.onOkAutoClose) {
            return;
          }
          hideFn();
        })
          .catch(() => {
            okPromiseResolve.value = false;
          });
      } else {
        hideFn();
      }
    };

    // 如果弹窗类型为 prompt，则先校验表单
    if (props.type === 'prompt' && props.inputRules.length > 0) {
      (formItemRef.value as any).validate('', function (validMsg: string) {
        if (!validMsg) {
          console.log('校验通过！');
          doClose();
        }
      });
      return;
    }
    doClose();
  };
  let cancelClick = function () {
    if (okLoadingInner.value) {
      return;
    }
    let okCancelResult = typeof props.onCancel === 'function' ? props.onCancel(hideFn) : true;
    if (okCancelResult === false) {
      return;
    }
    if (isPromise(okCancelResult)) {
      okCancelResult.then(() => {
        hideFn();
      });
    } else {
      hideFn();
    }
  };
  return {
    okClick,
    cancelClick,

    inputModelVal,
    okLoadingInner
  };
};
