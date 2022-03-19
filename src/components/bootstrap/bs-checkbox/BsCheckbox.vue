<template>
  <div
    class="form-check bs-checkbox"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-focus': isFocus,
      'is-checked': isChecked
    }">
    <input
      v-if="trueValue || falseValue"
      class="form-check-input"
      type="checkbox"
      autocomplete="off"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      :name="name || null"
      :id="checkboxId"
      :true-value="trueValue"
      :false-value="falseValue"
      v-model="checkboxVal"
      :disabled="disabled || disabledInner || isCountLimitDisable"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @change="on_change">
    <input
      v-else
      class="form-check-input"
      type="checkbox"
      autocomplete="off"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      :name="name || null"
      :id="checkboxId"
      :value="value"
      v-model="checkboxVal"
      :disabled="disabled || disabledInner || isCountLimitDisable"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
     @change="on_change">
    <label
      class="form-check-label"
      :for="checkboxId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  ComponentInternalInstance,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  nextTick
} from 'vue';
import { getCheckboxCount } from '@/common/globalData';
import { useGetParent } from '@/hooks/useGetParent';
import { useSetValidateStatus } from '@/hooks/useSetValidateStatus';
// 判断一个变量是否为空值
const varIsNone = function (variable:string|undefined|null):boolean {
  return variable === null || typeof variable === 'undefined' || (!Array.isArray(variable) && (variable + '').length === 0);
};
export default defineComponent({
  name: 'BsCheckbox',
  components: {},

  props: {
    modelValue: {
      type: [String, Number, Boolean, Array],
      default: undefined
    },
    value: {
      type: [String, Number, Boolean],
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
      validator (idVal: string) {
        if (/^\d/.test(idVal)) {
          console.warn('id不能以数字开头');
          return false;
        }
        return true;
      }
    },
    trueValue: { // 选中时的值
      type: [String, Number],
      default: undefined
    },
    falseValue: { // 没有选中时的值
      type: [String, Number],
      default: undefined
    },
    name: { // input原生的name属性
      type: String,
      default: ''
    },
    ariaLabel: { // area-label属性值
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  emits: ['update:modelValue', 'change'],
  setup (props: any, ctx: any) {
    let checkboxCount = getCheckboxCount();
    // 计算单选框的ID
    let checkboxId = ref(props.id || `bs-checkbox_${checkboxCount}`);
    let isFocus = ref(false);

    // 当前组件所在的父级<bs-checkbox-group>组件
    let $checkboxGroup = useGetParent('BsCheckboxGroup');
    // 当前组件所在的父级<bs-form-item>组件
    let $formItem = useGetParent('BsFormItem');

    // console.log('当前组建实例：', getCurrentInstance());
    // console.log('组件的<bs-checkbox-group>组件：', getCheckboxGroup());
    // 判断是否在<bs-checkbox-group>组件内
    let isInGroup = computed(() => {
      return !!$checkboxGroup.value;
    });
    // 存储当前复选框设置的值
    let selfModelVal = ref('');
    let checkboxVal = computed({
      get () {
        if (isInGroup.value) {
          let checkboxGroupIns:any = ($checkboxGroup.value as ComponentInternalInstance);
          return varIsNone(checkboxGroupIns.ctx.modelValue) ? checkboxGroupIns.ctx.value : checkboxGroupIns.ctx.modelValue;
        } else {
          return varIsNone(props.modelValue) ? (props.value || selfModelVal.value) : props.modelValue;
        }
      },
      set (newVal: any) {
        if (isInGroup.value) {
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
          // return props.value;
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
      if (isInGroup.value) {
        // let $checkboxGroupIns = $checkboxGroup.value as ComponentInternalInstance;
        flag = (Array.isArray(value) ? value : []).includes(props.value);
      } else {
        flag = varIsNone(props.modelValue) ? (value == props.trueValue || value == props.falseValue) : value === props.modelValue;
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
          return (checkboxVal.value || []).length >= max;
        }
        return false;
      }
      return false;
    });

    let disabledInner = ref(false);
    let setDisabled = function (flag: boolean) {
      disabledInner.value = false;
    };
    let { validateStatus, setValidateStatus, getValidateStatus } = useSetValidateStatus();
    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      nextTick(function () {
        if ($formItem.value) {
          ($formItem.value as any).ctx[fnName](...args);
        }
      });
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      let isChecked = (evt.target as HTMLInputElement).checked;
      // console.log('是否选中', isChecked);

      let value = '';
      if (isChecked) {
        value = !varIsNone(props.value) ? props.value : (varIsNone(props.trueValue) ? true : props.trueValue);
      } else {
        value = varIsNone(props.value) ? props.value : (varIsNone(props.falseValue) ? true : props.falseValue);
      }
      ctx.emit('change', value);

      callFormItem('validate', 'change');
    };

    onMounted(() => {
      // 设置默认选择项
      if (props.checked) {
        // 60秒后再设置默认选中向是因为有可能<bs-checkbox-group>组件的modelValue值为空字符串
        // 在<bs-checkbox-group>组件中，modelValue值若为字符串类型，会先转成数组，所以子组件在设置默认选中项时需延迟一点
        let timer = setTimeout(() => {
          clearTimeout(timer);
          if (Array.isArray(checkboxVal.value) && !checkboxVal.value.includes(props.value)) {
            checkboxVal.value.push(props.value);
          } else {
            checkboxVal.value = varIsNone(props.trueValue) ? true : props.trueValue;
          }
        }, 60);
      }
      // 如果当前组件处在<bs-form-item>组件中，则将其实例存储到<bs-form-item>组件中
      if ($formItem.value) {
        ($formItem.value as any).ctx.addChildComponent(getCurrentInstance() as ComponentInternalInstance);
      }
    });

    onUnmounted(function () {
      if ($formItem.value) {
        ($formItem.value as any).ctx.removeChildComponent(getCurrentInstance() as ComponentInternalInstance);
      }
    });

    return {
      checkboxId,
      isFocus,
      isChecked,
      isCountLimitDisable,

      checkboxVal,
      validateStatus,
      disabledInner,
      setDisabled,
      setValidateStatus,

      on_change
    };
  }
});
</script>

<style lang="scss">
.bs-checkbox{
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  & + .bs-checkbox{
    margin-left: 20px;
  }
  .form-check-input{
    margin-top: 0.35rem;
  }
  .form-check-label{
    padding-left: 0.3rem;
    margin-left: -0.3rem;
  }
}
</style>
