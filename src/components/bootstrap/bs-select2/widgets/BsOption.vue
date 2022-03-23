<template>
  <li
    class="bs-option"
    :class="{
      'is-disabled': disabled,
      'is-checked': isChecked
    }">
    <slot>
      <span class="bs-option-label">{{ label }}</span>
    </slot>
    <bs-icon name="check-lg" class="bs-option-check-icon"></bs-icon>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';

export default defineComponent({
  name: 'BsOption',
  props: {
    value: {
      type: [String, Number],
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
    let isChecked = ref(false);
    return {
      isChecked
    };
  }
});
</script>

<style lang="scss">
.bs-option{
  position: relative;
  padding: 0.3rem 1.2rem;
  color: #212529;
  transition: background-color .2s, color .2s;
  cursor: pointer;
  background-color: #fff;
  &:not(.is-disabled):hover{
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
    /*top: 0;*/
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
