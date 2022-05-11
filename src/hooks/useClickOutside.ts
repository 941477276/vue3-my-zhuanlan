import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';
import { useGlobalEvent } from '@/hooks/useGlobalEvent';
import { util } from '@/common/util';

export function useClickOutside (eleRefs: Ref<HTMLElement|null>|Ref<HTMLElement|null>[], callback?: (isClickOutside: boolean) => void):Ref {
  let flag = ref(false);
  let documentClickEvt = function (evt: MouseEvent) {
    let target = evt.target;
    if (Array.isArray(eleRefs)) {
      flag.value = !eleRefs.some(function (refItem) {
        // 点击的元素与参照元素一样，则不算点击在了外面
        if (refItem.value === target) {
          return true;
        }
        return util.elementContains(refItem.value, target);
      });
    } else {
      if (eleRefs.value === target) {
        flag.value = false;
      } else {
        flag.value = !util.elementContains(eleRefs.value, target);
      }
    }
    // console.log('document click event', flag.value);
    if (typeof callback == 'function') {
      callback(flag.value);
    }
  };
  onMounted(() => {
    // document.documentElement.addEventListener('click', documentClickEvt, false);
    useGlobalEvent.addEvent('document', 'click', documentClickEvt);
  });
  onBeforeUnmount(() => {
    // document.documentElement.removeEventListener('click', documentClickEvt, false);
    useGlobalEvent.removeEvent('document', 'click', documentClickEvt);
  });
  return flag;
}
