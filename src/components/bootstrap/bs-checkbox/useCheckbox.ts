import {
  Ref,
  onUpdated,
  computed,
  ref,
  inject
} from 'vue';
import { util } from '@/common/util';
import {
  checkboxGroupContextKey,
  CheckboxGroupContext
} from '@/ts-tokens/bootstrap';

export function useCheckbox (props: any, ctx: any, checkboxRef: Ref<HTMLInputElement|null>) {
  let selfModelVal = ref('');
  /* onUpdated(function () {
    console.log('useCheckbox updated');
  }); */
  // 当前组件所在的父级<bs-checkbox-group>组件的上下文
  let checkboxGroupCtx = inject<CheckboxGroupContext|null>(checkboxGroupContextKey, null);
  let checkboxVal = computed({
    get () {
      // console.log('checkbox checkboxVal get', checkboxId.value);
      if (checkboxGroupCtx) {
        return util.varIsNone(checkboxGroupCtx.props.modelValue) ? checkboxGroupCtx.props.value : checkboxGroupCtx.props.modelValue;
      } else {
        return util.varIsNone(props.modelValue) ? (props.value || selfModelVal.value) : props.modelValue;
      }
    },
    set (newVal: any) {
      // console.log('checkbox checkboxVal set', newVal);
      if (checkboxGroupCtx) {
        // console.log('是在复选框组中');
        let maxLimit = checkboxGroupCtx.props.max;
        if (typeof maxLimit !== 'number' || maxLimit <= 0) {
          // console.log('给复选框组设置新的值了: ', newVal);
          checkboxGroupCtx.changeVal(newVal);
          return;
        }
        if (newVal.length <= Math.floor(maxLimit)) {
          // console.log('给复选框组设置新的值了: ', newVal);
          checkboxGroupCtx.changeVal(newVal);
        }
      } else {
        // console.log('设置新的值了：', newVal);
        ctx.emit('update:modelValue', newVal);
        selfModelVal.value = newVal;
      }
    }
  });

  // 是否选中了
  let isChecked = computed(() => {
    let flag = false;
    let value = checkboxVal.value;
    let trueValue = props.trueValue;

    if (checkboxGroupCtx) {
      flag = (Array.isArray(value) ? value : []).includes(props.value);
    } else {
      if (util.varIsNone(props.modelValue)) {
        // flag = value === props.trueValue || value === props.falseValue;
        // 如果没有传递model值，但设置了trueValue则将当前值和trueValue进行比较
        if (!util.varIsNone(trueValue)) {
          flag = value === trueValue;
        } else {
          return value;
        }
      } else {
        // console.log(111, typeof value, value);
        if (typeof value === 'boolean') {
          return value;
        }
        if (!util.varIsNone(trueValue)) {
          return value === trueValue;
        }
        flag = Array.isArray(value) ? value.includes(props.value) : value === props.modelValue;
      }
    }
    return flag;
  });
  // 复选框组中允许选择的最大个数是否超出了
  let isCountLimitDisable = computed(() => {
    if (checkboxGroupCtx) {
      // console.log('isCountMaxLimit', 1);
      let max: number = checkboxGroupCtx.props.max;
      if (typeof max === 'number' && max > 0 && !isChecked.value) {
        // console.log('isCountMaxLimit', 22, (checkboxVal.value || '').length, max);
        let value = checkboxVal.value;
        return (value || []).length >= max;
      }
      return false;
    }
    return false;
  });

  return {
    checkboxVal,
    isChecked,
    isCountLimitDisable
  };
}
