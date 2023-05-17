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
import { BsColorType, supportedBsColorTypes } from '../../ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsBadge',
  props: {
    tag: { // 标签名
      type: String,
      default: 'span'
    },
    type: { // 类型
      type: String as PropType<BsColorType>,
      default: 'primary',
      validator (typeVal: BsColorType) {
        return supportedBsColorTypes.includes(typeVal);
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
