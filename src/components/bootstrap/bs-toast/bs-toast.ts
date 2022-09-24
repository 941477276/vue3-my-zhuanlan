import {
  AppContext,
  createVNode,
  render
} from 'vue';
import {
  isObject,
  isString,
  isFunction
} from '@vue/shared';
import BsToastComponent from './BsToast.vue';
import {
  isUndefined,
  isBoolean
} from '@/common/util';
import { useGetContentInfo } from '@/hooks/useGetContentInfo';
import {
  ToastCtx,
  getToastCtx,
  removeToastCtx
} from './bs-toast-ctxs';
import login from '@/pages/login/Login.vue';

let toastCount = 0;
function BsToast (options = {} as any, context?: AppContext | null) {
  console.log('BsToast', options);
  if (!options || !isObject(options)) {
    return null;
  }
  let { text: header, slotContent: headerSlot } = useGetContentInfo(options.header);
  let { text: title, slotContent: titleSlot } = useGetContentInfo(options.title);
  let { text: secondaryTitle, slotContent: secondaryTitleSlot } = useGetContentInfo(options.secondaryTitle);
  let { text: message, slotContent: messageSlot } = useGetContentInfo(options.message);
  let {
    fixed,
    placement,
    type,
    id,
    style,
    teleported,
    offsetTop,
    offsetLeft,
    appendTo,
    duration,
    onHide,
    zIndex,
    dangerouslyUseHTMLString,
    transitionName,
    showClose
  } = options;
  fixed = isBoolean(options.fixed) ? options.fixed : true;
  if (fixed) {
    if (!placement) {
      placement = 'top-right';
    }
  }

  if (!id || !isString(id)) {
    id = `bs-toast-api_${++toastCount}`;
  }
  // 创建vnode挂载的容器
  let container = document.createElement('div');
  container.className = 'bs-toast-container';
  container.setAttribute('data-for-id', id);

  console.log('appendTo11', appendTo);
  appendTo = (appendTo && isString(appendTo)) ? document.querySelector(appendTo) : appendTo;
  if (!appendTo) {
    appendTo = document.body;
  }

  let slots: {[key:string]: any} = {};
  if (headerSlot) {
    slots.header = headerSlot;
  }
  if (titleSlot) {
    slots.title = titleSlot;
  }
  if (secondaryTitleSlot) {
    slots.secondaryTitle = secondaryTitleSlot;
  }
  if (messageSlot) {
    slots.default = messageSlot;
  }
  let vm = createVNode(BsToastComponent, {
    title,
    secondaryTitle,
    message,
    fixed,
    placement,
    type,
    id,
    style,
    teleported: false,
    offsetTop,
    offsetLeft,
    appendTo: 'body',
    duration,
    zIndex,
    dangerouslyUseHTMLString,
    transitionName,
    showClose,
    onHide () {
      console.log('执行了api传递的onClose！');
      // 销毁实例
      render(null, container);
      // 移除container
      let timer = setTimeout(function () {
        clearTimeout(timer);
        let containerParent = container.parentElement;
        containerParent?.removeChild(container);
        appendTo = null;
        (vm as any) = null;
      }, 0);
      if (isFunction(onHide)) {
        onHide();
      }
    }
  }, slots);
  console.log('appendTo', appendTo);
  appendTo.appendChild(container);
  console.log('1111');

  render(vm, container);
  show(id);
  return {
    id,
    show () {
      show(id);
    },
    hide () {
      hide(id);
    }
  };
};

// 根据ID显示toast
function show (toastId: string) {
  if (!toastId) {
    return;
  }
  let toastCtx: ToastCtx = getToastCtx(toastId);
  if (toastCtx) {
    toastCtx.show();
  }
};
// 根据ID隐藏toast
function hide (toastId: string) {
  if (!toastId) {
    return;
  }
  let toastCtx: ToastCtx = getToastCtx(toastId);
  if (toastCtx) {
    toastCtx.hide();
  }
};

BsToast.show = show;
BsToast.hide = hide;

export {
  BsToast
};
export default BsToast;
