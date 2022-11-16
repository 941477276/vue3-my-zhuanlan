<template>
  <li
    class="bs-option-group"
    :class="{'is-disabled': disabled}">
    <div class="bs-option-group-title" :title="label">{{ label }}</div>
    <ul class="bs-option-group-list">
      <slot></slot>
    </ul>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  reactive
} from 'vue';
import {
  SelectOptionGroupContext,
  selectOptionGroupContextKey
} from '@/ts-tokens/bootstrap/select';

export default defineComponent({
  name: 'BsOptionGroup',
  props: {
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
    provide<SelectOptionGroupContext>(selectOptionGroupContextKey, reactive({
      props
    }));
    return {};
  }
});
</script>
