import {
  createVNode,
  render
} from 'vue';
import BsMask from './bs-mask.vue';
import {
  StringKeyObject
} from '@/ts-tokens/bootstrap';
import { useZIndex } from '@/hooks/useZIndex';

let maskCount = 0;
export function createMask (options: StringKeyObject = {}) {
  let destroyOnHide = !!options.destroyOnHide;
  let optionZIndex = options.zIndex;
  let id = `bs_mask-${++maskCount}`;

  let container = document.createElement('div');
  container.className = 'bs-mask-wrapper';
  container.setAttribute('data-for-id', id);

  let optionsCopy = {
    ...options
  };
  delete optionsCopy.destroyOnHide;
  let { nextZIndex } = useZIndex();
  let vm = createVNode(BsMask, {
    id,
    ...optionsCopy,
    onClick () {
      if (typeof options.onClick == 'function') {
        options.onClick();
      }
    },
    onShow () {
      if (typeof options.onShow == 'function') {
        options.onShow();
      }
    },
    onHide () {
      console.log(1111);
      if (destroyOnHide) {
        render(null, container);
        setTimeout(() => {
          document.body.removeChild(container);
        }, 0);
      }
      if (typeof options.onHide == 'function') {
        options.onHide();
      }
    }
  });

  document.body.appendChild(container);
  render(vm, container);

  return {
    show (zIndex = 0) {
      let component = vm.component as any;
      if (zIndex) {
        component.props.zIndex = zIndex;
      } else if (!optionZIndex) { // 如果未传递任何z-index，则使用全局zIndex
        component.props.zIndex = nextZIndex();
      }
      component.proxy.show();
    },
    hide () {
      let component = vm.component as any;
      component.proxy.hide();
    }
  };
};
