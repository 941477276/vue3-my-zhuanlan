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
      top: dropdownStyle.bottom == (void 0) ? (dropdownStyle.top + 'px') : 'auto',
      bottom: dropdownStyle.bottom != (void 0) ? (dropdownStyle.bottom + 'px') : ''
    }">
    <slot></slot>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  onBeforeMount,
  ref
} from 'vue';
import { NOOP, isObject } from '@vue/shared';
import {
  isUndefined,
  getStyle,
  getScrollParent,
  scrollTop
} from '@/common/bs-util';
import { getDropdownDirection } from './useDropdownDirection';
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
      top: 0,
      bottom: null
    });
    let targetEl: HTMLElement|null = null;
    // 参照元素有滚动条的父级节点
    let referenceScrollParent: HTMLElement|undefined;
    let isVisible = ref(false);
    let documentNodeNames = ['HTML', 'BODY'];

    // 刷新定位
    let refresh = function () {
      let referenceRef = props.referenceRef;
      let referenceEl: HTMLElement|null = null;
      if (referenceRef.nodeName) {
        referenceEl = referenceRef;
      } else if (isObject(referenceRef) && referenceRef.$el) {
        referenceEl = referenceRef.$el;
      }
      if (!targetEl || !referenceEl) {
        return;
      }
      let referenceElRect = referenceEl.getBoundingClientRect();
      // console.log('referenceElRect', referenceElRect);

      let displayDirection: any = getDropdownDirection(referenceEl, targetEl, props.placement, props.tryAllPlacement);
      let bottom = displayDirection.bottom;
      dropdownStyle.direction = displayDirection.direction;
      dropdownStyle.width = referenceElRect.width;
      dropdownStyle.top = isUndefined(bottom) ? displayDirection.top : null;
      dropdownStyle.left = displayDirection.left;
      dropdownStyle.bottom = isUndefined(bottom) ? null : displayDirection.bottom;
    };

    let onEnter = function (el:HTMLElement, done: () => void) {
      // 延迟50毫秒是为了解决目标元素使用v-if控制后导致元素位置计算不准确问题
      // let timer = setTimeout(function () {
      //   clearTimeout(timer);
      let referenceRef = props.referenceRef;
      let referenceEl: HTMLElement|null = null;
      console.log('referenceRef', referenceRef);
      if (!referenceRef) {
        console.log('referenceRef不存在!-----------------------');
        return;
      }
      if (referenceRef.nodeName) {
        referenceEl = referenceRef;
      } else if (isObject(referenceRef) && referenceRef.$el) {
        referenceEl = referenceRef.$el;
      }
      console.log('onEnter执行了', referenceEl?.nodeName, el);
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
      // }, !targetEl ? 50 : 0);

      referenceScrollParent = getScrollParent(referenceEl);
      let nodeName = referenceScrollParent?.nodeName || '';

      console.log('referenceScrollParent', referenceScrollParent?.nodeName);
      // 如果参照元素有有滚动条的父级节点且不为body，则给该父级节点绑定scroll事件，在容器滚动的时候刷新下拉位置
      if (referenceScrollParent && !documentNodeNames.includes(nodeName)) {
        console.log('参照元素有有滚动条的父级节点且不是body');
        referenceScrollParent.addEventListener('scroll', scrollEvent, false);
      }
      useGlobalEvent.addEvent('window', 'scroll', scrollEvent);
    };

    let onLeave = function (el: HTMLElement) {
      isVisible.value = false;
      let nodeName = referenceScrollParent?.nodeName || '';
      // 下拉隐藏后移除参照元素有有滚动条的父级节点的scroll事件
      if (referenceScrollParent && !documentNodeNames.includes(nodeName)) {
        referenceScrollParent.removeEventListener('scroll', scrollEvent, false);
      }
      useGlobalEvent.removeEvent('window', 'scroll', scrollEvent);
      referenceScrollParent = undefined;
      ctx.emit('after-leave', el);
    };

    let resizeTimer = 0;
    let resizeEventName = 'orientationchange' in window ? 'orientationchange' : 'resize';
    // 浏览器窗口大小改变事件
    let resizeEvent = function () {
      if (!isVisible.value) {
        return;
      }
      let now = new Date().getTime();
      if (resizeTimer == 0 || (now - resizeTimer >= 10)) {
        refresh();
        resizeTimer = now;
      }
    };

    // 滚动条滚动事件
    let scrollTimer = 0;
    let lastScrollTop = 0;
    // let lastScrollLeft = 0;
    let scrollEvent = function (evt: Event) {
      if (!isVisible.value || !targetEl) {
        return;
      }
      let now = new Date().getTime();
      console.log('now - scrollTimer: ', now - scrollTimer);
      if (scrollTimer == 0 || now - scrollTimer >= 10) {
        let targetElPosition = getStyle(targetEl, 'position');
        if (targetElPosition == 'fixed') {
          return;
        }
        let target = evt.currentTarget!;
        let currentScrollTop = 0;
        // let currentScrollLeft = 0;
        if (target === window || target === document) {
          currentScrollTop = scrollTop();
          // currentScrollLeft = scrollLeft();
        } else {
          currentScrollTop = (target as HTMLElement).scrollTop;
          // currentScrollLeft = (target as HTMLElement).scrollLeft;
        }
        // @ts-ignore
        console.log('currentScrollTop', currentScrollTop, lastScrollTop, target);
        /*
         由于 eleHasScroll() 函数判断元素是否有滚动条会触发滚动条事件，因此这里需要判断当前滚动条是否是由eleHasScroll函数触发的，如果是它触发的则不执行更新。
         如果滚动条是否是由eleHasScroll函数触发的，它的2次执行时间在10-20之间
         */
        if ((lastScrollTop == 0 && currentScrollTop == 1) || ((lastScrollTop == 0 && currentScrollTop == 0) && (now - scrollTimer < 20))) {
          console.log('这里拦掉了');
          return;
        }
        lastScrollTop = currentScrollTop;
        refresh();
        scrollTimer = now;
      }
    };

    onMounted(function () {
      useGlobalEvent.addEvent('window', resizeEventName, resizeEvent);
      // useGlobalEvent.addEvent('window', 'scroll', scrollEvent);
    });

    onBeforeMount(function () {
      useGlobalEvent.removeEvent('window', resizeEventName, resizeEvent);
      // useGlobalEvent.removeEvent('window', 'scroll', scrollEvent);
      targetEl = null;
      // 参照元素有滚动条的父级节点
      referenceScrollParent = undefined;
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
@import "bs-dropdown-transition";
</style>
