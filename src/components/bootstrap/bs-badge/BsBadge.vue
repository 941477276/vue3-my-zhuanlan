<template>
  <component
    class="bs-badge badge"
    :class="badgeClass"
    :is="tag"
    @click="onBadgeClick">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
// 定义支持的类型
type badgeType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
const supportTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'];

export default defineComponent({
  name: 'BsBadge',
  props: {
    tag: { // 标签名
      type: String,
      default: 'span'
    },
    type: { // 类型
      type: String as PropType<badgeType>,
      default: 'primary',
      validator (typeVal: badgeType) {
        return supportTypes.includes(typeVal);
      }
    },
    pill: { // 是否为胶囊样式
      type: Boolean,
      default: false
    },
    circle: { // 是否为小圆点样式
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup (props: any, ctx) {
    let badgeClass = computed<Array<string|unknown>>(() => {
      let classArr = [];
      let bntType = props.type;

      if (bntType) {
        classArr.push(`badge-${bntType}`);
      }
      if (props.pill) {
        classArr.push('badge-pill');
      }
      if (props.circle) {
        classArr.push('badge-circle');
      }
      return classArr;
    });
    let onBadgeClick = function (evt: MouseEvent): void {
      ctx.emit('click', evt);
    };

    return {
      badgeClass,
      onBadgeClick
    };
  }
});
</script>

<style lang="scss">
.bs-badge{
  &.badge-circle{
    display: inline-block;
    width: 0.85rem;
    height: 0.85rem;
    line-height: 0;
    border: 1px solid #f8f9fa;
    border-radius: 50%;
    overflow: hidden;
    font-size: 0;
    color: transparent;
  }
}
</style>
