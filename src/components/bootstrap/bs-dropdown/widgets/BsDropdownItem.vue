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
import { defineComponent } from 'vue';
// 定义vue实例类型
// type VueIns = InstanceType<typeof Vue>;
export default defineComponent({
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
  methods: {
    onDropdownItemClick (evt: MouseEvent) {
      // console.log('this', this.$parent);
      // 寻找距离当前组件最近的<bs-dropdown>组件，找到后调用它的hide方法
      let findParentWhichIsBsDropdown = function (compentIns: any): any {
        if (compentIns.$options.name === 'BsDropdown') {
          return compentIns;
        }
        let bsDropdownIns = findParentWhichIsBsDropdown(compentIns.$parent);
        if (bsDropdownIns) {
          return bsDropdownIns;
        }
      };
      let $parent = findParentWhichIsBsDropdown(this);
      if ($parent && typeof $parent.hide === 'function') {
        $parent.hide();
      }
      this.$emit('click', evt);
    }
  }
});
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
