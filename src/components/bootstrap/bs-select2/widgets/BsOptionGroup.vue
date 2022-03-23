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
import { defineComponent } from 'vue';

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
  }
});
</script>

<style lang="scss">
.bs-option-group-title{
  padding: 0.3rem 1.2rem;
  color: #6c757d;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
}
.bs-option-group{
  position: relative;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  &::before{
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e9ecef;
  }
  .bs-option{
    padding-left: 2rem;
  }
  &:first-child{
    margin-top: 0;
    &::before{
      display: none;
    }
  }
}
</style>
