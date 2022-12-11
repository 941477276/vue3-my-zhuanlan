import {
  ComponentInternalInstance, nextTick,
  ref,
  Ref
} from 'vue';
export function useDropdown (props: any, bsCascaderInputRef: Ref<any>) {
  let isFocus = ref(false);
  let dropdownDisplayed = ref(false); // 下拉菜单是否已经渲染
  let dropdownVisible = ref(false); // 下拉菜单是否显示
  /**
   * 显示下拉菜单
   */
  let dropdownShow = function () {
    if (props.disabled) {
      return;
    }
    let doShow = function () {
      dropdownVisible.value = true;
      if (!props.loading) {
        isFocus.value = true;
        (bsCascaderInputRef.value as any)?.focus();
      }
    };
    if (!dropdownDisplayed.value) {
      dropdownDisplayed.value = true;
      nextTick(doShow);
      return;
    }
    doShow();
  };
  /**
   * 隐藏下拉菜单
   */
  let dropdownHide = function () {
    // 延迟一会隐藏下拉菜单是因为为了等待背景色改变后再隐藏
    let timer = setTimeout(function () {
      clearTimeout(timer);
      dropdownVisible.value = false;
      isFocus.value = false;
      (bsCascaderInputRef.value as any)?.blur();
    }, 120);
  };

  return {
    isFocus,
    dropdownDisplayed,
    dropdownVisible,

    dropdownShow,
    dropdownHide
  };
};
