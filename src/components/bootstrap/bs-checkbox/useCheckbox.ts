import {
  onUpdated,
  ComponentInternalInstance,
  computed,
  ref
} from 'vue';
import { useGetParent } from '@/hooks/useGetParent';
import { util } from '@/common/util';

export function useCheckbox (props: any, ctx: any) {
  let selfModelVal = ref('');
  onUpdated(function () {
    console.log('useCheckbox updated');
  });
  // 当前组件所在的父级<bs-checkbox-group>组件
  let $checkboxGroup = useGetParent('BsCheckboxGroup');
  let checkboxVal = computed({
    get () {
      // console.log('checkbox checkboxVal get', checkboxId.value);
      if ($checkboxGroup.value) {
        let checkboxGroupIns:any = ($checkboxGroup.value as ComponentInternalInstance);
        return util.varIsNone(checkboxGroupIns.ctx.modelValue) ? checkboxGroupIns.ctx.value : checkboxGroupIns.ctx.modelValue;
      } else {
        return util.varIsNone(props.modelValue) ? (props.value || selfModelVal.value) : props.modelValue;
      }
    },
    set (newVal: any) {
      // console.log('checkbox checkboxVal set', newVal);
      if ($checkboxGroup.value) {
        // console.log('是在复选框组中');

        let checkboxGroupIns:any = ($checkboxGroup.value as ComponentInternalInstance);
        let maxLimit = checkboxGroupIns.ctx.max;
        if (typeof maxLimit !== 'number' || maxLimit <= 0) {
          // console.log('给复选框组设置新的值了: ', newVal);
          checkboxGroupIns.ctx.changeVal(newVal);
          return;
        }
        if (newVal.length <= Math.floor(maxLimit)) {
          // console.log('给复选框组设置新的值了: ', newVal);
          checkboxGroupIns.ctx.changeVal(newVal);
        }
      } else {
        console.log('设置新的值了：', newVal);
        ctx.emit('update:modelValue', newVal);
        selfModelVal.value = newVal;
      }
    }
  });

  // 是否选中了
  let isChecked = computed(() => {
    let flag = false;
    let value = checkboxVal.value;
    if ($checkboxGroup.value) {
      // let $checkboxGroupIns = $checkboxGroup.value as ComponentInternalInstance;
      flag = (Array.isArray(value) ? value : []).includes(props.value);
    } else {
      if (util.varIsNone(props.modelValue)) {
        flag = value == props.trueValue || value == props.falseValue;
      } else {
        flag = Array.isArray(value) ? value.includes(props.value) : value === props.modelValue;
      }
    }
    return flag;
  });
  // 复选框组中允许选择的最大个数是否超出了
  let isCountLimitDisable = computed(() => {
    if ($checkboxGroup.value) {
      // console.log('isCountMaxLimit', 1);
      let max: number = ($checkboxGroup.value as any).ctx.max;
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
