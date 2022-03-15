<template>
  <div
    class="bs-select"
    :class="{
    'is-disabled': disabled,
    'is-focus': isFocus
   }">
    <select
      ref="selectRef"
      v-model="selectVal"
      class="form-control"
      :class="sizeClass"
      :disabled="disabled"
      :multiple="multiple"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      @change="on_change"
      @focus="on_focus"
      @blur="on_blur">
      <slot></slot>
    </select>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
type InputSize = 'lg' | 'sm';
export default defineComponent({
  name: 'BsSelect',
  props: {
    modelValue: {
      type: [String, Array],
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: { // 是否支持多选
      type: Boolean,
      default: false
    },
    size: { // 输入框大小
      type: String as PropType<InputSize>,
      default: ''
    },
    id: {
      type: String,
      default: null,
      validator (idVal: string) {
        if (/^\d/.test(idVal)) {
          console.warn('id不能以数字开头');
          return false;
        }
        return true;
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    name: { // input原生的name属性
      type: String,
      default: null
    },
    ariaLabel: { // area-label属性值
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'change', 'focus', 'blur'],
  setup (props: any, ctx: any) {
    let selectRef = ref<HTMLSelectElement|null>(null);

    let selectVal = computed({
      get () {
        return props.modelValue || props.value;
      },
      set (newVal:string|string[]) {
        ctx.emit('update:modelValue', newVal);
        ctx.emit('change', newVal);
      }
    });

    // 计算输入框的class
    let sizeClass = computed<string>(() => {
      let sizeClass = props.size ? `form-control-${props.size}` : '';
      return sizeClass;
    });

    let isFocus = ref(false);
    /* eslint-disable */
    let on_focus = function (evt: Event) {
      isFocus.value = true;
      ctx.emit('focus', evt);
    };
    let on_blur = function (evt: Event) {
      isFocus.value = false;
      ctx.emit('blur', evt);
    };
    let on_change = function (evt: Event) {
      ctx.emit('change', Array.isArray(selectVal.value) ? [...selectVal.value] : selectVal.value);
    };


    setTimeout(() => {
      console.log('获得焦点');
      focus();
    }, 2500);

    return {
      selectVal,
      sizeClass,
      isFocus,
      selectRef,

      on_focus,
      on_blur,
      on_change,
    };
  }
});
</script>

<style lang="scss">
.bs-select{
  display: inline-block;
  vertical-align: middle;
}
</style>
