import { computed, ref, watch } from 'vue';

/**
 * 当为密码输入框时切换密文/密码原文
 * @param props
 */
function usePasswordIsShow (props: any) {
  let passwordIsShow = ref(false); // 密码是否显示了
  // 切换输入框类型为密码或文本
  let togglePasswordText = () => {
    if (props.showPassword) {
      passwordIsShow.value = !passwordIsShow.value;
    }
  };
  return {
    passwordIsShow,
    togglePasswordText
  };
}

export function useInput (props: any) {
  let { passwordIsShow, togglePasswordText } = usePasswordIsShow(props);
  // 计算输入框的class
  let inputClass = computed<string>(() => {
    let sizeClass = props.size ? `input-group-${props.size}` : '';
    return sizeClass;
  });
  // 处理input的type
  let inputType = computed(() => {
    if (props.showPassword && passwordIsShow.value) {
      return 'text';
    }
    return props.type;
  });

  // 处理input的值
  let inputValue = ref<string|number>(props.modelValue);
  watch(() => props.modelValue, newVal => {
    if (inputValue.value != newVal) {
      inputValue.value = newVal;
    }
  });

  return {
    inputClass,
    inputType,
    inputValue,
    passwordIsShow,

    togglePasswordText
  };
}
