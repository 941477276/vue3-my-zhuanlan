<template>
  <transition
    name="bs-slide"
    @before-enter="$emit('before-enter', $event)"
    @enter="onEnter"
    @after-enter="$emit('after-enter', $event)"
    @before-leave="$emit('before-leave', $event)"
    @leave="$emit('leave', $event)"
    @after-leave="$emit('after-leave', $event)"
    class="bs-slide-transition"
    :class="[
      `bs-placement-${dropdownStyle.direction}`,
      {
        'use-bottom': dropdownStyle.bottom != null
      }
    ]"
    :style="{
      position: position,
      ...(setWidth ? { width: dropdownStyle.width + 'px' } : {}),
      left: dropdownStyle.left + 'px',
      top: dropdownStyle.bottom == null ? (dropdownStyle.top + 'px') : 'auto',
      bottom: dropdownStyle.bottom != null ? (dropdownStyle.bottom + 'px') : ''
    }">
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive
} from 'vue';
import { NOOP } from '@vue/shared';
import { util } from '@/common/util';

export default defineComponent({
  name: 'BsDropdownTransition',
  props: {
    referenceRef: { // 参照元素ref
      type: Object,
      default () {
        return {};
      }
    },
    placement: { // 下拉菜单展示方位
      type: String,
      default: 'bottom'
    },
    tryAllPlacement: { // 默认是否尝试所有方位
      type: Boolean,
      default: true
    },
    position: { // 定位方式
      type: String,
      default: 'absolute'
    },
    setWidth: { // 是否设置下拉菜单到宽度等于参照元素
      type: Boolean,
      default: false
    }
  },
  emits: ['before-enter', 'enter', 'after-enter', 'before-leave', 'leave', 'after-leave'],
  setup (props: any, ctx: any) {
    // 下拉菜单样式
    let dropdownStyle = reactive({
      // position: 'absolute',
      direction: 'bottom',
      width: 0,
      left: 0,
      top: -1,
      bottom: null
    });

    let onEnter = function (el:HTMLElement, done: () => void) {
      // 延迟20毫秒是为了解决目标元素使用v-if控制后导致元素位置计算不准确问题
      let timer = setTimeout(function () {
        clearTimeout(timer);
        let referenceEl = props.referenceRef as HTMLElement;
        console.log('onEnter执行了', referenceEl.nodeName, el);
        if (!referenceEl) {
          console.log('参照元素不存在!-----------------------');
          return;
        }
        if (!el) {
          console.log('目标元素不存在!========================');
          return;
        }
        let referenceElRect = referenceEl.getBoundingClientRect();
        // console.log('referenceElRect', referenceElRect);

        let displayDirection: any = util.calcAbsoluteElementDisplayDirection(referenceEl, el, props.placement, props.tryAllPlacement);
        dropdownStyle.direction = displayDirection.direction;
        dropdownStyle.width = referenceElRect.width;
        dropdownStyle.top = displayDirection.top;
        dropdownStyle.left = displayDirection.left;
        dropdownStyle.bottom = typeof displayDirection.bottom == 'undefined' ? null : displayDirection.bottom;

        let onTransitionDone = function () {
          done();
          el.removeEventListener('transitionend', onTransitionDone, false);
          el.removeEventListener('transitioncancel', onTransitionDone, false);
        };
        // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
        el.addEventListener('transitionend', onTransitionDone, false);
        el.addEventListener('transitioncancel', onTransitionDone, false);
        ctx.emit('enter', el, NOOP);
      }, 20);
    };
    return {
      dropdownStyle,

      onEnter
    };
  }
});
</script>

<style lang="scss">
@import "../../../scss/slide-transition.mixin";
.bs-slide-transition{
  &.bs-placement-top,
  &.bs-placement-topRight{
    margin-top: -.35rem;
    &.use-bottom{
      margin-top: auto;
      margin-bottom: .35rem;
    }
    @include slide-top;
  }
  &.bs-placement-bottom,
  &.bs-placement-bottomRight{
    margin-top: .35rem;
    @include slide-down;
  }
  &.bs-placement-left,
  &.bs-placement-leftBottom{
    margin-left: -.35rem;
    @include slide-left;
  }
  &.bs-placement-right,
  &.bs-placement-rightBottom{
    margin-left: .35rem;
    @include slide-right;
  }
}
</style>
