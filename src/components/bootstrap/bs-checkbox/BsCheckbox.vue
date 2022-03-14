<template>
  <div
    class="form-check bs-checkbox"
    :class="{
      'is-disabled': disabled || disabledInner,
      'is-focus': isFocus
    }">
    <input
      v-if="trueValue || falseValue"
      class="form-check-input"
      type="checkbox"
      autocomplete="off"
      :name="name || null"
      :id="checkboxId"
      :true-value="trueValue"
      :false-value="falseValue"
      v-model="checkboxVal"
      :disabled="disabled || disabledInner"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @change="on_change">
    <input
      v-else
      class="form-check-input"
      type="checkbox"
      autocomplete="off"
      :name="name || null"
      :id="checkboxId"
      :value="value"
      v-model="checkboxVal"
      :disabled="disabled || disabledInner"
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
  onUpdated,
  getCurrentInstance,
  ComponentInternalInstance,
  onMounted
} from 'vue';
import { getCheckboxCount } from '@/common/globalData';
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
    let checkboxId = computed(() => {
      return props.id || `bs-checkbox_${checkboxCount}`;
    });
    let isFocus = ref(false);

    // 获取当前组件所在的父级<bs-checkbox-group>组件
    let getCheckboxGroup = function ():ComponentInternalInstance|null {
      let $parent = (getCurrentInstance() as ComponentInternalInstance).parent;

      // console.log('$parent', $parent);
      while ($parent && $parent?.type.name !== 'BsCheckboxGroup') {
        $parent = $parent?.parent || null;
      }
      // console.log('$parent', $parent);

      return $parent;
    };
    // 当前组件所在的父级<bs-checkbox-group>组件
    let $checkboxGroup = ref<ComponentInternalInstance|null>(getCheckboxGroup());
    onUpdated(() => {
      // 组件更新的时候重新获取当前组件的父级<bs-checkbox-group>组件
      $checkboxGroup.value = getCheckboxGroup();
    });

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
          return props.value;
        } else {
          return varIsNone(props.modelValue) ? (props.value || selfModelVal.value) : props.modelValue;
        }
      },
      set (newVal: any) {
        if (isInGroup.value) {
          // return props.value;
        } else {
          console.log('设置新的值了：', newVal);
          ctx.emit('update:modelValue', newVal);
          selfModelVal.value = newVal;
        }
      }
    });
    let isChecked = computed(() => {
      let flag = false;
      if (isInGroup.value) {
        let $checkboxGroupIns = $checkboxGroup.value as ComponentInternalInstance;
        flag = (props.value === $checkboxGroupIns.props.modelValue) || (props.value === $checkboxGroupIns.props.value);
      } else {
        // flag = checkboxCheckedInner.value; // || props.modelValue === props.value;
      }
      return flag;
    });

    let disabledInner = ref(false);
    let setDisabled = function (flag: boolean) {
      disabledInner.value = false;
    };

    /* eslint-disable */
    let on_change = function (evt: Event) {
      let isChecked = (evt.target as HTMLInputElement).checked;
      console.log('是否选中', isChecked);

      let value = '';
      if (isChecked) {
        value = !varIsNone(props.value) ? props.value : (varIsNone(props.trueValue) ? true : props.trueValue);
      } else {
        value = varIsNone(props.value) ? props.value : (varIsNone(props.falseValue) ? true : props.falseValue);
      }
      ctx.emit('change', value);

      if (isInGroup.value) {
      //
      }
    };

    onMounted(() => {
      // 设置默认选择项
      if (props.checked) {
        if (Array.isArray(checkboxVal.value) && !checkboxVal.value.includes(props.value)) {
          checkboxVal.value.push(props.value);
        } else {
          checkboxVal.value = varIsNone(props.trueValue) ? true : props.trueValue;
        }
      }
    });

    return {
      checkboxId,
      isFocus,
      isChecked,

      checkboxVal,
      disabledInner,
      setDisabled,

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
