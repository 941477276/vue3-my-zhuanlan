<template>
  <div class="dropdown-divider" v-if="divider"></div>
  <li
    class="dropdown-item"
    :class="{disabled: disabled, active: active}"
    @click="onDropdownItemClick">
    <slot></slot>
  </li>
</template>

<script lang="ts">

export default {
  name: 'BsDropdownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    divider: { // 是否有线条
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup (props: any, ctx: any) {
    let onDropdownItemClick = (evt: MouseEvent) => {
      if (props.disabled) {
        return;
      }
      ctx.emit('click', evt);
    };
    return {
      onDropdownItemClick
    };
  }
};
</script>

<style lang="scss">
.dropdown{
  display: inline-block;
  vertical-align: middle;
  &.is-disabled{
    opacity: 0.65;
    cursor: default;
    pointer-events: none;
  }
}
</style>
