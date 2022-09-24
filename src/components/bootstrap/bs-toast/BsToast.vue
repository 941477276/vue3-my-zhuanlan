<template>
  <teleport :to="appendTo" :disabled="!teleported">
    <transition
      :name="transitionName"
      @after-enter="$emit('show', $event)"
      @after-leave="$emit('hide', $event)">
      <div
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
  addToastCtx,
  removeToastCtx,
  addFixedToastId,
  allowedPlacements
} from './bs-toast-ctxs';
import { useZIndex } from '@/hooks/useZIndex';
import {
  ToastPlacement
} from '@/ts-tokens/bootstrap/toast';
import {
  BsColorType
} from '@/ts-tokens/bootstrap';

let toastCount = 0;
export default defineComponent({
  name: 'BsToast',
  props: bsToastProps,
  emits: ['click', 'show', 'hide'],
  setup (props: any, ctx: any) {
    let toastId = ref(props.id ? props.id : `bs-toast_${++toastCount}`);

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
    let show = function () {
      if (visible.value) {
        return;
      }
      visible.value = true;
      zIndexInner.value = props.zIndex || nextZIndex();
      startTimer();
    };
    let hide = function () {
      visible.value = false;
      console.log('调用了hdie');
      clearTimer();
    };

    // 存储当前toast的上下文
    addToastCtx(toastId.value, {
      show,
      hide
    });
    let placement = props.placement;
    // 存储fixed定位的toast id
    if (props.fixed && allowedPlacements.includes(placement)) {
      addFixedToastId(toastId.value, placement);
    }

    onUnmounted(function () {
      removeToastCtx(toastId.value);
    });

    return {
      toastId,
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
