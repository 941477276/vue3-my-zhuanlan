<template>
  <div
    class="form-check bs-radio"
    :class="{
      'is-disabled': disabled,
      'is-readonly': disabled,
      'is-focus': isFocus
    }">
    <input
      class="form-check-input"
      type="radio"
      autocomplete="off"
      :name="name || null"
      :id="radioId"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      :checked="isChecked"
      :aria-label="ariaLabel || null"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @change="on_change">
    <label
      class="form-check-label"
      :for="radioId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch, onUpdated } from 'vue';
import { getRadioCount } from '@/common/globalData';

export default defineComponent({
  name: 'BsRadio',
  components: {},

  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
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
    let radioCount = getRadioCount();
    // 计算单选框的ID
    let radioId = computed(() => {
      return props.id || `bs-radio_${radioCount}`;
    });
    let isFocus = ref(false);
    let isChecked = computed(() => {
      return props.modelValue === props.value;
    });

    /* eslint-disable */
    let on_change = function (evt: Event) {
      console.log(evt);
      ctx.emit('update:modelValue', props.value);
      ctx.emit('change', props.value, evt);
    };
    return {
      radioId,
      isFocus,
      isChecked,

      on_change
    };
  }
});
</script>

<style lang="scss">
.bs-radio{
  display: inline-block;
  vertical-align: middle;
  & + .bs-radio{
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
