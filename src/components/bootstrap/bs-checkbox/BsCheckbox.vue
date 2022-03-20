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
      ref="checkboxRef"
      class="form-check-input"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      type="checkbox"
      autocomplete="off"
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
      ref="checkboxRef"
      class="form-check-input"
      :class="{
        'is-valid': validateStatus === 'success',
        'is-invalid': validateStatus === 'error'
      }"
      type="checkbox"
      autocomplete="off"
      v-model="checkboxVal"
      :name="name || null"
      :id="checkboxId"
      :value="value"
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
import { useCheckbox } from './useCheckbox';
import { util } from '@/common/util';

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
    let checkboxRef = ref<HTMLInputElement|null>(null);
    // 计算单选框的ID
    let checkboxId = ref(props.id || `bs-checkbox_${getCheckboxCount()}`);
    let isFocus = ref(false);

    // 当前组件所在的父级<bs-checkbox-group>组件
    // let $checkboxGroup = useGetParent('BsCheckboxGroup');
    // 当前组件所在的父级<bs-form-item>组件
    let $formItem = useGetParent('BsFormItem');
    let { checkboxVal, isChecked, isCountLimitDisable } = useCheckbox(props, ctx);

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
        value = !util.varIsNone(props.value) ? props.value : (util.varIsNone(props.trueValue) ? true : props.trueValue);
      } else {
        value = util.varIsNone(props.value) ? props.value : (util.varIsNone(props.falseValue) ? true : props.falseValue);
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
          let checkboxValue = checkboxVal.value;
          if (Array.isArray(checkboxValue) && !checkboxValue.includes(props.value)) {
            checkboxValue.push(props.value);
          } else {
            checkboxVal.value = util.varIsNone(props.trueValue) ? true : props.trueValue;
          }
        }, 60);
      }
      // 如果当前组件处在<bs-form-item>组件中，则将其实例存储到<bs-form-item>组件中
      if ($formItem.value) {
        ($formItem.value as any).ctx.addChildComponent(getCurrentInstance() as ComponentInternalInstance);
      }
    });

    onUnmounted(function () {
      /* TODO
        当checkbox移除的时候，<bs-form-item>组件并不能将其从数组中移除掉，很奇怪
       */
      if ($formItem.value) {
        ($formItem.value as any).ctx.removeChildComponent(getCurrentInstance() as ComponentInternalInstance);
      }
      // 设置默认选择项
      if (props.checked) {
        let checkboxValue = checkboxVal.value;
        if (Array.isArray(checkboxValue)) {
          console.log('onUnmounted checkboxValue 11', checkboxValue);
          let index = checkboxValue.findIndex(item => item === props.value);
          if (index > -1) {
            checkboxValue.splice(index, 1);
          }
        } else {
          console.log('onUnmounted checkboxValue 22', checkboxValue);
          checkboxVal.value = false;
        }
      }
    });

    return {
      checkboxRef,
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
