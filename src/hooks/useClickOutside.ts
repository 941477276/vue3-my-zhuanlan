import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { util } from '@/common/util';

export function useClickOutside (ele: HTMLElement, callback?: (isClickOutside: boolean) => void):Ref {
  let flag = ref(false);
  let documentClickEvt = function (evt: MouseEvent) {
    flag.value = !util.elementContains(ele, evt.target);
    console.log('document click event', flag.value);
    if (typeof callback == 'function') {
      callback(flag.value);
    }
  };
  onMounted(() => {
    document.documentElement.addEventListener('click', documentClickEvt, false);
  });
  onUnmounted(() => {
    document.documentElement.removeEventListener('click', documentClickEvt, false);
  });
  return flag;
}
