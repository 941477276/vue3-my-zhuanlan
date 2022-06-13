<template>
  <BsTooltip
    v-bind="$props"
    :popperClass="['bs-popover popover', popperClass]"
    :pure="false"
    :arrowClass="arrowClass"
    :popper-style="[
      {
        maxWidth: width ? (typeof width === 'number' ? width + 'px' : width) : ''
      },
      popperStyle
    ]"
    @before-show="$emit('before-show')"
    @before-hide="$emit('before-hide')"
    @content-mouseenter="$emit('content-mouseenter')"
    @content-mouseleave="$emit('content-mouseleave')"
    @show="$emit('show')"
    @hide="$emit('hide')">
    <slot></slot>
    <template #content>
      <h3 class="popover-header" v-if="showTitle && ($slots.title || title)">
        <slot name="title">{{ title }}</slot>
      </h3>
      <div class="popover-body">
        <slot name="content">
          <template v-if="!rawContent">{{ content }}</template>
          <div v-else v-html="content"></div>
        </slot>
      </div>
    </template>
  </BsTooltip>
</template>

<script lang="ts">
import BsTooltip from '../bs-tooltip/BsTooltip.vue';
import {
  defineComponent
} from 'vue';
import { bsPopperContentProps } from '../bs-popper/bs-popper-content-props';
import { bsTooltipContentProps } from '../bs-tooltip/bs-tooltip-content-props';
import { bsTooltipTriggerProps } from '../bs-tooltip/bs-tooltip-trigger-props';

export default defineComponent({
  name: 'BsPopover',
  components: {
    BsTooltip
  },
  props: {
    arrowClass: { // 三角箭头的class
      type: String,
      default: ''
    },
    virtualTriggering: { // 是否由虚拟元素触发
      type: Boolean,
      default: false
    },
    virtualRef: { // 触发元素的ref
      type: [String, Function, Object],
      default: null
    },
    showDelay: { // 延迟出现，单位毫秒
      type: Number,
      default: 100
    },
    hideDelay: { // 延迟关闭，单位毫秒
      type: Number,
      default: 200
    },
    ...bsPopperContentProps,
    ...bsTooltipContentProps,
    ...bsTooltipTriggerProps
  },
  emits: ['before-show', 'before-hide', 'content-mouseenter', 'content-mouseleave', 'show', 'hide']
});
</script>

<style lang="scss">
@import "bs-popover";
</style>
