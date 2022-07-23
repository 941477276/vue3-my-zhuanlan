import { computed, ref } from 'vue';

export function useInput (props: any, ctx: any) {
  let bsInputReadonly = computed(function () {
    if (props.filterable) {
      return false;
    }
    return true;
  });
  let bsInputFocus = ref(false);
  // 输入框显示的内容
  let bsInputValue = computed(function () {
    if (props.multiple) {
      return '';
    }
    let values = props.values;
    if (Array.isArray(values)) {
      return values[0]?.label;
    }
    return values?.label;
  });
  let bsInputPlaceholder = computed(function () {
    if (!props.multiple) {
      if (props.loading) {
        return props.loadingText;
      }
      return bsInputFocus.value ? bsInputValue.value : props.placeholder;
    }
    if (props.values.length > 0) {
      return ' ';
    } else if (props.loading) {
      if (props.loading) {
        return props.loadingText;
      }
    }
    return props.placeholder;
  });
  let bsInputModelValue = computed({
    get () {
      // 如果是单选且输入框聚焦了，则将输入框的内容清空
      if (bsInputFocus.value || props.multiple) {
        return '';
      }
      return bsInputValue.value;
    },
    set (newValue) {
      console.log('newValue', newValue);
      ctx.emit('filter-text-change', newValue);
    }
  });
  let onBsInputFocus = function () {
    if (props.filterable) {
      bsInputFocus.value = true;
    }
  };
  let onBsInputBlur = function () {
    if (props.filterable) {
      bsInputFocus.value = false;
    }
  };

  return {
    bsInputReadonly,
    bsInputModelValue,
    bsInputValue,
    bsInputFocus,
    bsInputPlaceholder,

    onBsInputFocus,
    onBsInputBlur
  };
};
