<template>
  <transition
    name="fade"
    @before-leave="isLeaving = true"
    @after-leave="isLeaving = false">
    <div
      ref="triggerRef"
      v-show="visible"
      class="bs-back-top"
      :class="{
        'fixed-position': isFixedPosition
      }"
      :style="{
        top: triggerElStyle.top == '' ? '' : (triggerElStyle.top + 'px'),
        right: triggerElStyle.right == '' ? '' : (triggerElStyle.right + 'px')
      }"
      @click="doBackTop">
      <slot>
        <div class="bs-back-top-inner">
          <i></i>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  onUpdated,
  onMounted,
  computed,
  watch
} from 'vue';
import {
  isFunction,
  isString,
  isObject
} from '@vue/shared';
import { useGlobalEvent } from '@/hooks/useGlobalEvent';
import { util } from '@/common/util';
import { left } from '@popperjs/core';

const defaultTop = '80%';
const defaultRight = '30px';
export default defineComponent({
  name: 'BsBackTop',
  props: {
    target: {
      type: [Object, String, Function],
      default () {
        return window;
      }
    },
    visibilityHeight: { // 滚动高度达到此参数值才显示按钮，支持固定值、百分比
      type: [String, Number],
      default: 400
    },
    useFixedPosition: { // 是否使用fixed定位
      type: Boolean,
      default: null
    },
    duration: { // 滚动持续时间
      type: Number,
      default: 150
    },
    top: { // 触发元素的 style.top 值，支持固定值、百分比
      type: [String, Number],
      default: ''
    },
    right: { // 触发元素的 style.right 值，支持固定值、百分比
      type: [String, Number],
      default: ''
    }
  },
  setup (props:any, ctx: any) {
    let currentTarget = ref<Element|Window|null>(null);
    let triggerRef = ref<HTMLElement|null>(null);
    let triggerElStyle = reactive({
      right: '',
      top: ''
    });
    let visible = ref(false);
    let isScrolling = false;
    let isLeaving = ref(false); // 是否正在离开

    let lastTime = 0;
    let onScroll = function () {
      console.log('onScroll');
      let triggerEl = triggerRef.value;
      let target = currentTarget.value;
      let now = new Date().getTime();
      if (now > 0 && (now - lastTime < 100)) {
        return;
      }
      if (!triggerEl || !target || isScrolling) {
        return;
      }
      lastTime = now;
      let isTriggerFixed = util.getStyle(triggerEl, 'position') === 'fixed';
      let visibleHeight = props.visibilityHeight;
      let scrollTop = util.scrollTop(target);
      let targetClientHeight = target === window ? window.innerHeight : (target as HTMLElement).clientHeight;
      let targetHeight = target === window ? document.documentElement.offsetHeight : (target as HTMLElement).clientHeight;
      console.log('visibleHeight, scrollTop, targetHeight, targetClientHeight', visibleHeight, scrollTop, targetHeight, targetClientHeight);
      if (isString(visibleHeight)) {
        if (visibleHeight.charAt(visibleHeight.length - 1) == '%') { // 百分比
          let percent = Number(visibleHeight.replace('%', '')) / 100;
          visibleHeight = targetHeight * percent;
        } else { // 固定值
          visibleHeight = parseFloat(visibleHeight);
        }
      }
      console.log('new visibleHeight', visibleHeight);
      let flag = scrollTop >= visibleHeight;
      /* if (flag) {
        calcTriggerStyle(target as HTMLElement);
      } */
      visible.value = flag;
    };
    /* watch(visible, function (isVisible:boolean) {
      if (isVisible) {
        calcTriggerStyle(currentTarget.value as HTMLElement);
      }
    }); */
    let onElementScroll = function () {
      if (visible.value || isScrolling) {
        // @ts-ignore
        let target = this as HTMLElement;
        console.log('onElementScroll 执行了', util.scrollTop(target));
        calcTriggerStyle(target);
      }
    };
    // 添加事件
    let addEvent = function (newTarget: Element|Window|null, isUpdate = false) {
      console.log(`${isUpdate ? '更新' : '新增'}事件监听`);
      let currentTargetVal = currentTarget.value;
      if (isUpdate) {
        console.log('更新Target，移除旧Target的事件');
        if (currentTargetVal === window) {
          useGlobalEvent.removeEvent('window', 'scroll', onScroll);
        } else {
          currentTargetVal?.removeEventListener('scroll', onScroll, false);
          currentTargetVal?.removeEventListener('scroll', onElementScroll, false);
        }
      }
      currentTarget.value = newTarget;
      currentTargetVal = newTarget;
      if (currentTargetVal === window) {
        console.log('新增事件，window');
        useGlobalEvent.addEvent('window', 'scroll', onScroll);
      } else {
        currentTargetVal?.addEventListener('scroll', onScroll, false);
        currentTargetVal?.addEventListener('scroll', onElementScroll, false);
      }
    };
    // 移除事件
    let removeEvent = function () {
      console.log('移除事件监听');
      let currentTargetVal = currentTarget.value;
      if (currentTargetVal === window) {
        useGlobalEvent.removeEvent('window', 'scroll', onScroll);
      } else {
        currentTargetVal?.removeEventListener('scroll', onScroll, false);
        currentTargetVal?.removeEventListener('scroll', onElementScroll, false);
      }
      currentTarget.value = null;
    };

    let initTarget = function () {
      let propsTarget = props.target;
      let targetTemp: Element|Window|null = null;
      let currentTargetVal = currentTarget.value;
      if (isFunction(propsTarget)) {
        targetTemp = propsTarget();
      } else if (isString(propsTarget)) {
        targetTemp = document.querySelector(propsTarget);
      } else if (propsTarget && isObject(propsTarget) && (propsTarget.nodeType == 1 || propsTarget === window)) {
        targetTemp = propsTarget as Element;
      }
      if (!targetTemp && !currentTargetVal) {
        console.log('没有target');
        return;
      }
      if (!targetTemp && currentTargetVal) {
        // 移除事件监听
        removeEvent();
      }
      if (targetTemp && !currentTargetVal) {
        // 新增
        addEvent(targetTemp, false);
      }
      if (targetTemp !== currentTargetVal) {
        // 更新
        addEvent(targetTemp, true);
      }
    };

    // 计算元素的定位值
    let calcTriggerStyle = function (targetEl:HTMLElement) {
      let { top, right } = props;
      let target = currentTarget.value;
      let style = {
        top,
        right
      };
      if (!target) {
        return;
      }
      if (target === window) {
        return style;
      }
      let clientHeight = targetEl.clientHeight;
      let clientLeft = targetEl.clientLeft;
      // let scrollHeight = targetEl.scrollHeight;
      let scrollTop = util.scrollTop(targetEl);
      let scrollLeft = util.scrollLeft(targetEl);
      // 防止滚动条滚动到0的时候还去计算了一下定位
      if (scrollTop == 0 && scrollLeft == 0) {
        return;
      }
      if (!top && top !== 0) {
        top = defaultTop;
      }
      console.log('top 111', top, scrollTop);
      if (isString(top)) {
        if (top.charAt(top.length - 1) == '%') { // 百分比
          console.log(1111);
          let percent = Number(top.replace('%', '')) / 100;
          top = clientHeight * percent;
        } else { // 固定值
          top = parseFloat(top);
        }
      }
      top += scrollTop;
      if (!right && right !== 0) {
        right = defaultRight;
      }
      if (isString(right)) {
        if (right.charAt(right.length - 1) == '%') { // 百分比
          let percent = Number(right.replace('%', '')) / 100;
          right = clientLeft * percent;
        } else { // 固定值
          right = parseFloat(right);
        }
      }
      right += scrollLeft;

      console.log('top, right', top, right);
      triggerElStyle.top = top;
      triggerElStyle.right = right;
    };

    // 是否使用固定定位
    let isFixedPosition = computed(function () {
      let currentTargetVal = currentTarget.value;
      let useFixedPosition = props.useFixedPosition;
      if (useFixedPosition === false || useFixedPosition === true) {
        return useFixedPosition;
      }
      if (currentTargetVal === window) {
        return true;
      }
      return false;
    });

    onUpdated(initTarget);
    onMounted(initTarget);

    let doBackTop = function () {
      console.log('返回顶部');
      let target = currentTarget.value;
      if (!target || isScrolling) {
        return;
      }
      isScrolling = true;
      util.scrollTo(target, 'y', 0, props.duration || 150, function () {
        console.log('滚动至顶完毕');
        isScrolling = false;
        visible.value = false;
      });
    };
    return {
      triggerRef,
      visible,
      isFixedPosition,
      triggerElStyle,
      isLeaving,

      doBackTop
    };
  }
});
</script>

<style lang="scss">
.bs-back-top{
  //display: none;
  position: absolute;
  right: 30px;
  bottom: 30px;
  cursor: pointer;
  z-index: 3000;
  &.fixed-position{
    position: fixed;
  }
  &.fade-enter-active,
  &.fade-leave-active{
    transition: opacity .2s;
  }
  &.fade-enter-from,
  &.fade-leave-to{
    opacity: .4;
  }
  &.fade-enter-to,
  &.fade-leave-from{
    opacity: 1;
  }
}
.bs-back-top-inner{
  //position: relative;
  display: flex;
  width: 2rem;
  height: 2rem;
  //line-height: 2rem;
  text-align: center;
  border-radius: 0.125rem;
  background-color: rgba(0,0,0,0.45);
  transition: background-color .3s;
  i{
    display: block;
    transform: translateY(calc(0.625rem / 4));
    margin: auto;
    &::before{
      display: block;
      content: ' ';
      width: 0.625rem;
      height: 0.625rem;
      border-top: 2px solid #efefef;
      border-left: 2px solid #efefef;
      transform: rotate(45deg);
      //margin-top: 0.3125rem;
    }
  }
  &:hover{
    background-color: rgba(0,0,0,0.6);
  }
}
</style>
