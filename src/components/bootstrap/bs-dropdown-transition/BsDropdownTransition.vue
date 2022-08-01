<template>
  <transition
    name="bs-slide"
    @before-enter="$emit('before-enter', $event)"
    @enter="onEnter"
    @after-enter="$emit('after-enter', $event)"
    @before-leave="$emit('before-leave', $event)"
    @leave="$emit('leave', $event)"
    @after-leave="onLeave"
    class="bs-dropdown-transition"
    :class="[
      `bs-placement-${dropdownStyle.direction}`,
      {
        'use-bottom': dropdownStyle.bottom != null
      }
    ]"
    :style="{
      position: position,
      ...(setWidth ? { width: dropdownStyle.width + 'px' } : {}),
      ...(setMinWidth ? { minWidth: dropdownStyle.width + 'px' } : {}),
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
  reactive,
  onMounted,
  onUnmounted, ref
} from 'vue';
import { NOOP } from '@vue/shared';
import { util } from '@/common/util';
import { useGlobalEvent } from '@/hooks/useGlobalEvent';

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
    setWidth: { // 是否设置下拉菜单的宽度等于参照元素的宽度
      type: Boolean,
      default: false
    },
    setMinWidth: { // 是否设置下拉菜单的最小宽度等于参照元素的宽度
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
    let targetEl: HTMLElement|null = null;
    let isVisible = ref(false);

    // 刷新定位
    let refresh = function () {
      let referenceEl = props.referenceRef as HTMLElement;
      if (!targetEl || !referenceEl) {
        return;
      }
      let referenceElRect = referenceEl.getBoundingClientRect();
      // console.log('referenceElRect', referenceElRect);

      let displayDirection: any = util.calcAbsoluteElementDisplayDirection(referenceEl, targetEl, props.placement, props.tryAllPlacement);
      dropdownStyle.direction = displayDirection.direction;
      dropdownStyle.width = referenceElRect.width;
      dropdownStyle.top = displayDirection.top;
      dropdownStyle.left = displayDirection.left;
      dropdownStyle.bottom = typeof displayDirection.bottom == 'undefined' ? null : displayDirection.bottom;
    };

    let onEnter = function (el:HTMLElement, done: () => void) {
      // 延迟50毫秒是为了解决目标元素使用v-if控制后导致元素位置计算不准确问题
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
        isVisible.value = true;
        targetEl = el;
        refresh();

        let onTransitionDone = function () {
          done();
          el.removeEventListener('transitionend', onTransitionDone, false);
          el.removeEventListener('transitioncancel', onTransitionDone, false);
        };
        // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
        el.addEventListener('transitionend', onTransitionDone, false);
        el.addEventListener('transitioncancel', onTransitionDone, false);
        ctx.emit('enter', el, NOOP);
      }, !targetEl ? 50 : 0);
    };

    let onLeave = function (el: HTMLElement) {
      isVisible.value = false;
      ctx.emit('after-leave', el);
    };

    let resizeTimer = 0;
    let resizeEventName = 'orientationchange' in window ? 'orientationchange' : 'resize';
    // 浏览器窗口大小改变事件
    let resizeEvent = function () {
      let now = new Date().getTime();
      if (!isVisible.value) {
        return;
      }
      if (resizeTimer == 0 || now - resizeTimer >= 125) {
        refresh();
        resizeTimer = now;
      }
    };

    // 滚动条滚动事件
    let scrollTimer = 0;
    let scrollEvent = function () {
      if (!isVisible.value || !targetEl) {
        return;
      }
      let targetElPosition = util.getStyle(targetEl, 'position');
      if (targetElPosition == 'fixed') {
        return;
      }
      let now = new Date().getTime();
      if (scrollTimer == 0 || now - scrollTimer >= 125) {
        refresh();
        scrollTimer = now;
      }
    };

    onMounted(function () {
      useGlobalEvent.addEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.addEvent('window', 'scroll', scrollEvent);
    });

    onUnmounted(function () {
      useGlobalEvent.removeEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.removeEvent('window', 'scroll', scrollEvent);
      targetEl = null;
    });

    return {
      dropdownStyle,

      onEnter,
      onLeave,
      refresh
    };
  }
});
</script>

<style lang="scss">
@import "../../../scss/slide-transition.mixin";
.bs-dropdown-transition{
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
