<template>
  <div
    class="bs-dropdown dropdown"
    :class="[{'is-disabled': disabled}, `bs-dropdown-direction-${displayDirection}`]"
    ref="dropdownRef">
    <BsOnlyChild>
      <slot></slot>
    </BsOnlyChild>
    <teleport :disabled="!teleported" :to="appendTo">
      <transition
        name="slide"
        @before-enter="transitionLeaveDone = false"
        @enter="onEnter"
        @after-leave="transitionLeaveDone = true">
        <div
          v-if="display"
          v-show="visible"
          ref="dropdownMenuRef"
          class="bs-dropdown-menu dropdown-menu"
          :class="[
            dropdownMenuClass,
            `bs-placement-on-${displayDirection}`,
            {
              'use-bottom': dropdownMenuStyle.bottom != null
            }
          ]"
          :style="{
            position: dropdownMenuStyle.position,
            left: dropdownMenuStyle.left + 'px',
            // top: dropdownMenuStyle.top + 'px',
            top: dropdownMenuStyle.bottom == null ? (dropdownMenuStyle.top + 'px') : 'auto',
            bottom: dropdownMenuStyle.bottom != null ? (dropdownMenuStyle.bottom + 'px') : '',
            zIndex: dropdownMenuStyle.zIndex
          }"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave">
          <slot name="dropdown-content"></slot>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  PropType,
  defineComponent,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch,
  Ref,
  computed
} from 'vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  bsDropdownProps
} from './props';
import {
  useZIndex
} from '@/hooks/useZIndex';
import {
  useGlobalEvent
} from '@/hooks/useGlobalEvent';
import {
  useForwardRef
} from '@/hooks/useForwardRef';

// 下来菜单显示方向
type directions = 'bottom' | 'top' | 'left' | 'right';

interface CalcDirection {
  left: number,
  top: number,
  bottom: number,
  vertical: boolean,
  horizontal: boolean,
  direction: directions
}

export default defineComponent({
  name: 'BsDropdown',
  components: {
    BsOnlyChild
  },
  props: {
    ...bsDropdownProps
  },
  emits: ['show', 'hide'],
  setup (props: any, ctx: any) {
    let loaded = ref(false);
    let visible = ref(false);
    // 触发元素
    let triggerRef = ref<HTMLElement|null>(null);
    useForwardRef(triggerRef);

    let dropdownRef = ref<HTMLElement|null>(null);
    let dropdownMenuRef = ref<HTMLElement|null>(null);
    let dropdownMenuStyle = reactive({
      position: 'absolute',
      left: 0,
      top: -1,
      bottom: null,
      zIndex: ''
    });
    let toggleEl: HTMLElement|null; // 触发下拉菜单显示/隐藏的dom元素

    let displayDirection = ref(props.placement);
    let transitionLeaveDone = ref(false); // 过渡动画是否执行完毕
    let display = computed(function () {
      // 如果开启了“隐藏时销毁下拉内容”则需等离开过渡动画执行完毕后再销毁
      if (props.destroyDropdownMenuOnHide && !visible.value && transitionLeaveDone.value) {
        return false;
      }
      return !props.lazy || loaded.value;
    });

    let isClickOutside = useClickOutside([dropdownRef, dropdownMenuRef]); // 是否点击了下拉菜单的外面
    let { nextZIndex } = useZIndex();

    // 计算下拉菜单的显示位置
    let calcDirection = function () {
      if (!toggleEl) {
        return;
      }
      let directionInfo = util.calcAbsoluteElementDisplayDirection(toggleEl, dropdownMenuRef.value, props.placement, true) as CalcDirection;
      console.log('directionInfo', directionInfo);
      dropdownMenuStyle.left = directionInfo.left;
      dropdownMenuStyle.top = directionInfo.top;
      dropdownMenuStyle.bottom = (typeof directionInfo.bottom == 'undefined' ? null : directionInfo.bottom) as any;
      displayDirection.value = directionInfo.direction;
    };

    let showTimer: number;
    let hideTimer: number;
    // 显示
    let show = function () {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      if (props.disabled) {
        return;
      }
      showTimer = setTimeout(() => {
        clearTimeout(showTimer);
        if (!loaded.value) {
          loaded.value = true;
        }
        visible.value = true;
        if (props.teleported && props.appendTo === 'body') {
          dropdownMenuStyle.zIndex = nextZIndex() + '';
        }

        let toggleElIsInFixedContainer = util.eleIsInFixedParents(toggleEl);
        if (toggleElIsInFixedContainer && props.teleported) {
          dropdownMenuStyle.position = 'fixed';
        } else {
          dropdownMenuStyle.position = 'absolute';
        }

        ctx.emit('show');
      }, props.trigger == 'click' ? 0 : 150);
    };
    // 隐藏
    let hide = function (delayTime = 0) {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      // 鼠标离开trigger el后不立即隐藏下拉菜单，因为有可能鼠标是移动到了下拉菜单本身中
      hideTimer = setTimeout(() => {
        clearTimeout(hideTimer);
        visible.value = false;
        ctx.emit('hide');
      }, delayTime || (props.trigger == 'click' ? 0 : 150));
    };

    // trigger el点击事件
    let clickEvent = function () {
      if (props.disabled) {
        if (visible.value) {
          hide();
        }
        return;
      }
      visible.value ? hide() : show();
    };

    let onMouseEnter = function () {
      if (props.disabled || props.trigger !== 'hover') {
        return;
      }
      show();
    };
    let onMouseLeave = function () {
      if (props.disabled || props.trigger !== 'hover') {
        return;
      }
      hide();
    };

    /* let onDropdownMouseenter = function () {
      if (props.disabled || props.trigger !== 'hover') {
        return;
      }
      show();
    };
    let onDropdownMouseleave = function () {
      if (props.disabled || props.trigger !== 'hover') {
        return;
      }
      hide();
    }; */

    let resizeTimer = 0;
    let resizeEventName = 'orientationchange' in window ? 'orientationchange' : 'resize';
    // 浏览器窗口大小改变事件
    let resizeEvent = function () {
      let now = new Date().getTime();
      if (!visible.value) {
        return;
      }
      if (resizeTimer == 0 || now - resizeTimer >= 200) {
        // calcDirection();
        resizeTimer = now;
      }
    };

    // 滚动条滚动事件
    let scrollTimer = 0;
    let scrollEvent = function () {
      if (!visible.value || dropdownMenuStyle.position == 'fixed') {
        return;
      }
      let now = new Date().getTime();
      if (scrollTimer == 0 || now - scrollTimer >= 125) {
        // calcDirection();
        scrollTimer = now;
      }
    };

    let stopWatchClickOutside = watch(isClickOutside, (newVal: Ref) => {
      // console.log('watch isClickOutside', newVal);
      if (newVal) {
        hide();
      }
    });

    let onEnter = function (el:HTMLElement, done: () => void) {
      console.log('onEnter执行了');
      calcDirection();
      let onTransitionDone = function () {
        done();
        // console.log('leave onTransitionDone');
        el.removeEventListener('transitionend', onTransitionDone, false);
        el.removeEventListener('transitioncancel', onTransitionDone, false);
      };
      // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
      el.addEventListener('transitionend', onTransitionDone, false);
      el.addEventListener('transitioncancel', onTransitionDone, false);
    };

    let stopWatchTriggerRef: () => void;
    onMounted(() => {
      stopWatchTriggerRef = watch(() => triggerRef.value, (triggerEl) => {
        toggleEl = triggerEl;
        if (triggerEl) {
          if (props.addDropdownToggleClass) {
            util.addClass(triggerEl, 'dropdown-toggle');
          }
          triggerEl.addEventListener('click', clickEvent, false);
          triggerEl.addEventListener('mouseenter', onMouseEnter, false);
          triggerEl.addEventListener('mouseleave', onMouseLeave, false);
        }
      }, { immediate: true });

      useGlobalEvent.addEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.addEvent('window', 'scroll', scrollEvent);
    });
    onBeforeUnmount(() => {
      useGlobalEvent.removeEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.removeEvent('window', 'scroll', scrollEvent);
      stopWatchClickOutside();
      stopWatchTriggerRef();
      toggleEl = null;
    });

    return {
      display,
      visible,
      loaded,
      dropdownRef,
      dropdownMenuRef,
      isClickOutside,
      dropdownMenuStyle,
      displayDirection,
      transitionLeaveDone,

      hide,
      show,
      onMouseEnter,
      onMouseLeave,
      // onDropdownMouseenter,
      // onDropdownMouseleave,
      onEnter
    };
  }
});
</script>

<style lang="scss">
@import "bs-dropdown";
</style>
