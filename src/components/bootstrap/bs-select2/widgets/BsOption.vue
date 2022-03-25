<template>
  <li
    class="bs-option"
    :class="{
      'is-disabled': isDisabled,
      'is-checked': isSelected
    }"
    @click="onOptionClick">
    <slot>
      <span class="bs-option-label">{{ label }}</span>
    </slot>
    <bs-icon name="check-lg" class="bs-option-check-icon"></bs-icon>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  computed
} from 'vue';
import { getSelectOptionCount } from '@/common/globalData';
import {
  SelectContext,
  SelectOptionGroupContext,
  selectContextKey,
  selectOptionGroupContextKey
} from '@/ts-tokens/bootstrap/select';

export default defineComponent({
  name: 'BsOption',
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    label: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props: any) {
    let optionId = `selectOption_${getSelectOptionCount()}`;
    let selectCtx = inject<SelectContext|null>(selectContextKey, null);
    let optionGroupCtx = inject<SelectOptionGroupContext|null>(selectOptionGroupContextKey, null);

    let isSelected = computed<boolean>(function () {
      if (selectCtx) {
        let selectModelValue: unknown[] = Array.isArray(selectCtx.props.modelValue) ? selectCtx.props.modelValue : [selectCtx.props.modelValue];
        let propsVal = props.value;
        return selectModelValue.some(modelValItem => modelValItem === propsVal);
      }
      return false;
    });

    let isDisabled = computed<boolean>(function () {
      if (optionGroupCtx) {
        return optionGroupCtx.props.disabled;
      }
      return props.disabled;
    });

    let onOptionClick = function () {
      if (!isDisabled.value && selectCtx) {
        if (selectCtx.props.multiple) {
          selectCtx.changeVal(props.value, isSelected.value);
        } else {
          selectCtx.changeVal(props.value);
        }
      }
    };

    return {
      isSelected,
      isDisabled,
      onOptionClick
    };
  }
});
</script>

<style lang="scss">
.bs-option{
  position: relative;
  padding: 0.3rem 1.2rem;
  color: #212529;
  transition: background-color .1s, color .1s;
  cursor: pointer;
  background-color: #fff;
  &:not(.is-disabled,.is-checked):hover{
    background-color: #E9ECEF;
  }
  &.is-disabled{
    cursor: not-allowed;
    opacity: 0.6;
  }
  &.is-checked{
    color: #fff;
    background-color: #007BFF;
  }
  .bs-option-label{
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bs-option-check-icon{
    display: none;
    position: absolute;
    z-index: 5;
    top: 50%;
    transform: translateY(-50%);
    right: 1.1rem;
    font-size: 1.5rem;
  }
}
.bs-select-dropdown.is-multiple{
  .bs-option{
    padding-right: 2.4rem;
    &.is-checked{
      color: #007BFF;
      background-color: #fff;
      .bs-option-check-icon{
        display: block;
      }
    }
  }
}
</style>
