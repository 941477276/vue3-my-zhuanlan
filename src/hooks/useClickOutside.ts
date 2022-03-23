import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';
import { util } from '@/common/util';

export function useClickOutside (eleRefs: Ref<HTMLElement|null>|Ref<HTMLElement|null>[], callback?: (isClickOutside: boolean) => void):Ref {
  let flag = ref(false);
  let documentClickEvt = function (evt: MouseEvent) {
    let target = evt.target;
    if (Array.isArray(eleRefs)) {
      flag.value = !eleRefs.some(function (refItem) {
        return util.elementContains(refItem.value, target);
      });
    } else {
      flag.value = !util.elementContains(eleRefs.value, target);
    }
    // console.log('document click event', flag.value);
    if (typeof callback == 'function') {
      callback(flag.value);
    }
  };
  onMounted(() => {
    document.documentElement.addEventListener('click', documentClickEvt, false);
  });
  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('click', documentClickEvt, false);
  });
  return flag;
}
