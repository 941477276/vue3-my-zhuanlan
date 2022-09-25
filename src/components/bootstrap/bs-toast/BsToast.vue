<template>
  <teleport :to="appendTo" :disabled="!teleported">
    <transition
      :name="transitionName"
      @after-enter="$emit('show', $event)"
      @after-leave="$emit('hide', $event)">
      <div
        ref="toastRef"
        class="bs-toast toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        v-show="visible"
        :class="classNames"
        :id="toastId"
        :style="[
          {
            zIndex: zIndexInner
          },
          style
        ]"
        @click="$emit('click', $event)"
        @mouseenter="clearTimer"
        @mouseleave="startTimer">
        <div
          class="toast-header"
          :class="[type ? `bg-${type}` : '']">
          <div class="toast-header-content">
            <slot name="header">
              <strong class="bs-toast-title">
                <slot name="title">{{ title }}</slot>
              </strong>
              <small v-if="secondaryTitle" class="bs-toast-secondary-title">
                <slot name="secondaryTitle">{{ secondaryTitle }}</slot>
              </small>
            </slot>
          </div>
          <button
            v-if="showClose"
            type="button"
            class="close"
            data-dismiss="toast"
            aria-label="Close"
            @click.stop="hide">
            <slot name="close"><span aria-hidden="true">&times;</span></slot>
          </button>
        </div>
        <div class="toast-body">
          <slot>
            <div v-if="dangerouslyUseHTMLString" v-html="message"></div>
            <template v-else>{{ message }}</template>
          </slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import {
  PropType,
  ref,
  computed,
  defineComponent,
  onUnmounted
} from 'vue';
import { bsToastProps } from './bs-toast-props';
import {
  FixedToastItem,
  addToastCtx,
  removeToastCtx,
  addFixedToastId,
  removeFixedToastId,
  getFixedToastIdsByPlacement,
  allowedPlacements
} from './bs-toast-ctxs';
import { useZIndex } from '@/hooks/useZIndex';

let toastCount = 0;
export default defineComponent({
  name: 'BsToast',
  props: bsToastProps,
  emits: ['click', 'show', 'hide'],
  setup (props: any, ctx: any) {
    let toastId = ref(props.id ? props.id : `bs-toast_${++toastCount}`);
    let toastRef = ref<HTMLElement | null>(null);

    // 组件类名
    let classNames = computed(function () {
      let classArr = [props.className];
      let type = props.type;
      if (type) {
        classArr.push(`bs-toast-${type}`);
        // classArr.push(`bg-${type}`);
      }
      if (props.fixed) {
        classArr.push('position-fixed');
      }
      let placement = props.placement;
      if (placement && allowedPlacements.includes(placement)) {
        classArr.push(`bs-toast-placement-${placement}`);
      }
      let customClass = props.customClass;
      if (Array.isArray(customClass)) {
        classArr.push(...customClass);
      } else {
        classArr.push(customClass);
      }
      return classArr;
    });

    let { nextZIndex } = useZIndex();
    let zIndexInner = ref(props.zIndex || '');
    let visible = ref(false);
    let timer:number;
    let clearTimer = function () {
      if (props.duration > 0) {
        clearTimeout(timer);
      }
    };
    let startTimer = function () {
      if (props.duration > 0) {
        clearTimer();
        timer = setTimeout(hide, props.duration);
      }
    };

    let placement = props.placement;
    // 计算显示位置
    let calcPosition = function () {
      // 判断是否从底部弹出
      let isBottom = placement?.startsWith('bottom');
      let toastIds = getFixedToastIdsByPlacement(placement);
      if (toastIds.length == 0) {
        return;
      }

      let offsetTop = props.offsetTop;
      if (offsetTop < 1) {
        offsetTop = 20;
      }
      let result = toastIds.reduce(function (res: number, item: FixedToastItem) {
        let el = document.getElementById(item.toastId);
        let elHeight = el?.offsetHeight || 0;
        res += elHeight;
        if (elHeight > 0) {
          res += item.offsetTop;
        }
        return res;
      }, 0);
      result += offsetTop;
      console.log(`【${toastId.value}】的显示位置为：${result}px!`);
      // positionStyle[isBottom ? 'bottom' : 'top'] = result + 'px';
      (toastRef.value as any).style[isBottom ? 'bottom' : 'top'] = result + 'px';
    };
    // 显示
    let show = function () {
      if (visible.value) {
        return;
      }
      placement = props.placement;
      if (props.fixed && allowedPlacements.includes(placement)) {
        // addFixedToastId(toastId.value, placement);
        calcPosition();
        // 存储fixed定位的toast id
        addFixedToastId(toastId.value, placement, props.offsetTop);
      }
      visible.value = true;
      zIndexInner.value = props.zIndex || nextZIndex();
      startTimer();
    };

    // 更新在队列中的toast位置
    let updateInQueueToastPosition = function (removedToastIndex: number) {
      if (removedToastIndex == -1) {
        return;
      }
      let fixedToastIds = getFixedToastIdsByPlacement(placement);
      // 从上一个被移除的toast开始，被移除的toast前面的toast的位置不需要更新
      let needUpdatePositionFixedToastIds = fixedToastIds.slice(removedToastIndex);
      if (needUpdatePositionFixedToastIds.length == 0) {
        return;
      }
      // 计算被移除的toast前面的toast位置，这样就得到一个位置基数
      let positionBase = fixedToastIds.slice(0, removedToastIndex).reduce(function (res: number, item: FixedToastItem) {
        let el = document.getElementById(item.toastId);
        let elHeight = el?.offsetHeight || 0;
        res += elHeight;
        if (elHeight > 0) {
          res += item.offsetTop;
        }
        return res;
      }, 0);
      let prevToastOffsetTops = 0;
      let prevToastHeights = 0;
      let isBottom = placement?.startsWith('bottom');
      needUpdatePositionFixedToastIds.forEach(function (item: FixedToastItem) {
        let el = document.getElementById(item.toastId);
        if (!el) {
          return;
        }
        let result = positionBase + item.offsetTop + prevToastOffsetTops + prevToastHeights;
        let elHeight = el.offsetHeight;

        prevToastHeights += elHeight;
        if (elHeight > 0) {
          prevToastOffsetTops += item.offsetTop;
        }

        el.style[isBottom ? 'bottom' : 'top'] = result + 'px';
      });
    };
    // 隐藏
    let hide = function () {
      visible.value = false;
      console.log('调用了hdie');
      clearTimer();
      if (props.fixed && allowedPlacements.includes(placement)) {
        // 移除fixed定位的toast id
        let removeFixedToastIndex = removeFixedToastId(toastId.value, placement);
        updateInQueueToastPosition(removeFixedToastIndex);
      }
    };

    // 存储当前toast的上下文
    addToastCtx(toastId.value, {
      show,
      hide
    });

    onUnmounted(function () {
      removeToastCtx(toastId.value);
      let placement = props.placement;
      if (props.fixed && allowedPlacements.includes(placement)) {
        // 移除fixed定位的toast id
        let removeFixedToastIndex = removeFixedToastId(toastId.value, placement);
        updateInQueueToastPosition(removeFixedToastIndex);
      }
    });

    return {
      toastId,
      toastRef,
      classNames,
      visible,
      zIndexInner,

      show,
      hide,
      clearTimer,
      startTimer
    };
  }
});
</script>

<style lang="scss">
@import "bs-toast";
</style>
