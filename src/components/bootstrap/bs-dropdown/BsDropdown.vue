<template>
  <div
    class="bs-dropdown dropdown"
    :class="[{'is-disabled': disabled}, `bs-dropdown-direction-${displayDirection}`]"
    ref="dropdownRef">
    <slot></slot>
    <teleport to="body">
      <transition
        name="slide"
        @before-enter="transitionLeaveDone = false"
        @after-leave="transitionLeaveDone = true">
        <div
          v-if="display"
          v-show="visible"
          ref="dropdownMenuRef"
          class="bs-dropdown-menu dropdown-menu"
          :class="[
          dropdownMenuClass,
          `bs-dropdown-menu-direction-${displayDirection}`
        ]"
          :style="{
            position: dropdownMenuStyle.position,
            left: dropdownMenuStyle.left + 'px',
            top: dropdownMenuStyle.top + 'px',
            zIndex: dropdownMenuStyle.zIndex
          }">
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
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  BsPlacement
} from '@/ts-tokens/bootstrap';
import {
  useZIndex
} from '@/hooks/useZIndex';
import {
  useGlobalEvent
} from '@/hooks/useGlobalEvent';

// 下来菜单显示方向
type directions = 'bottom' | 'top' | 'left' | 'right';
// 触发类型
type triggers = 'click' | 'hover';
interface CalcDirection {
  left: number,
  top: number,
  vertical: boolean,
  horizontal: boolean,
  direction: directions
}

export default defineComponent({
  name: 'BsDropdown',
  props: {
    placement: { // 显示方向
      type: String as PropType<BsPlacement>,
      default: 'bottom'
    },
    tryReverseDirection: { // 当在props.direction方向不能完全显示时，是否尝试反方向显示
      type: Boolean,
      default: true
    },
    tryAllDirection: { // 当在props.direction方向不能完全显示时，是否尝试所有方向显示
      type: Boolean,
      default: false
    },
    trigger: { // 触发下拉菜单显示的事件
      type: String as PropType<triggers>,
      default: 'hover'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    lazy: { // 是否延迟渲染
      type: Boolean,
      default: true
    },
    destroyDropdownMenuOnHide: { // 隐藏时是否销毁 dropdown-menu
      type: Boolean,
      default: false
    },
    dropdownMenuClass: { // .dropdown-menu的额外class
      type: String,
      default: ''
    }
  },
  emits: ['show', 'hide'],
  setup (props: any, ctx: any) {
    let loaded = ref(false);
    let visible = ref(false);
    let dropdownRef = ref<HTMLElement|null>(null);
    let dropdownMenuRef = ref<HTMLElement|null>(null);
    let dropdownMenuStyle = reactive({
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1000
    });
    let toggleEl: HTMLElement; // 触发下拉菜单显示/隐藏的dom元素
    let eventTimer: number;
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
      let directionInfo = util.calcAbsoluteElementDisplayDirection(toggleEl, dropdownMenuRef.value, props.placement, true) as CalcDirection;
      console.log('directionInfo', directionInfo);
      dropdownMenuStyle.left = directionInfo.left;
      dropdownMenuStyle.top = directionInfo.top;
      displayDirection.value = directionInfo.direction;
    };
    // 显示
    let show = function () {
      clearTimeout(eventTimer);
      if (props.disabled) {
        return;
      }
      eventTimer = setTimeout(() => {
        clearTimeout(eventTimer);
        if (!loaded.value) {
          loaded.value = true;
        }
        visible.value = true;
        dropdownMenuStyle.zIndex = nextZIndex();

        let toggleElIsInFixedContainer = util.isInFixedParents(toggleEl);
        if (toggleElIsInFixedContainer) {
          dropdownMenuStyle.position = 'fixed';
        } else {
          dropdownMenuStyle.position = 'absolute';
        }

        nextTick(() => {
          /* let directionInfo = util.calcAbsoluteElementDisplayDirection(toggleEl, dropdownMenuRef.value, props.placement, true) as CalcDirection;
          console.log('directionInfo', directionInfo);
          dropdownMenuStyle.left = directionInfo.left;
          dropdownMenuStyle.top = directionInfo.top;
          displayDirection.value = directionInfo.direction; */
          calcDirection();

          ctx.emit('show');
        });
      }, props.trigger == 'click' ? 0 : 150);
    };
    // 隐藏
    let hide = function (delayTime = 0) {
      if (delayTime != 0) {
        clearTimeout(eventTimer);
      }
      // 鼠标离开trigger el后不立即隐藏下拉菜单，因为有可能鼠标是移动到了下拉菜单本身中
      eventTimer = setTimeout(() => {
        clearTimeout(eventTimer);
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

    let mouseLeaveTimer: number;
    let onMouseEnter = function () {
      if (props.disabled) {
        return;
      }
      clearTimeout(mouseLeaveTimer);
      show();
    };

    // 鼠标离开事件
    let mouseMoveEventTarget: EventTarget|null; // 这里必须把触发鼠标移动事件的目标元素放到外面，这样当鼠标从下拉菜单触发元素移动到下拉菜单的时候才能始终保持显示
    let onMousemove = function (evt: MouseEvent) {
      if (!visible.value) {
        return;
      }
      mouseMoveEventTarget = evt.target;
      // clearTimeout(mouseLeaveTimer);
      // 延迟一会才好计算鼠标是否在元素内
      mouseLeaveTimer = setTimeout(function () {
        clearTimeout(mouseLeaveTimer);

        let mouseInDropdownEl = util.elementContains(dropdownRef.value, mouseMoveEventTarget);
        let mouseInDropdownMenuEl = util.elementContains(dropdownMenuRef.value, mouseMoveEventTarget);
        // console.log('mouseInDropdownEl', mouseMoveEventTarget, mouseInDropdownEl, mouseInDropdownMenuEl);
        if (!mouseInDropdownEl) {
          mouseInDropdownEl = dropdownRef.value === mouseMoveEventTarget;
        }
        if (!mouseInDropdownMenuEl) {
          mouseInDropdownMenuEl = dropdownMenuRef.value === mouseMoveEventTarget;
        }
        // console.log('timeOut', !mouseInDropdownEl, !mouseInDropdownMenuEl);
        if (!mouseInDropdownEl && !mouseInDropdownMenuEl) {
          hide(0);
        }
      }, 210);
    };

    let resizeTimer = 0;
    let resizeEventName = 'orientationchange' in window ? 'orientationchange' : 'resize';
    // 浏览器窗口大小改变事件
    let resizeEvent = function () {
      let now = new Date().getTime();
      if (!visible.value) {
        return;
      }
      if (resizeTimer == 0 || now - resizeTimer >= 200) {
        /* let directionInfo = util.calcAbsoluteElementDisplayDirection(toggleEl, dropdownMenuRef.value, props.placement, true) as CalcDirection;
        // console.log('resize event directionInfo', directionInfo);
        dropdownMenuStyle.left = directionInfo.left;
        dropdownMenuStyle.top = directionInfo.top;
        displayDirection.value = directionInfo.direction; */
        calcDirection();
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
        calcDirection();
        scrollTimer = now;
      }
    };

    // 绑定事件
    let bindEvent = function () {
      switch (props.trigger) {
        case 'click':
          toggleEl.addEventListener('click', clickEvent, false);
          break;
        case 'hover':
          toggleEl.addEventListener('mouseenter', onMouseEnter, false);
          // toggleEl.addEventListener('mouseleave', onMousemove, false);
          // document.documentElement.addEventListener('mousemove', onMousemove, false);
          useGlobalEvent.addEvent('document', 'mousemove', onMousemove);
          break;
      }
      useGlobalEvent.addEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.addEvent('window', 'scroll', scrollEvent);
    };
    // 解绑事件
    let offEvent = function () {
      switch (props.trigger) {
        case 'click':
          toggleEl.removeEventListener('click', clickEvent, false);
          break;
        case 'hover':
          toggleEl.removeEventListener('mouseenter', onMouseEnter, false);
          // toggleEl.removeEventListener('mouseleave', onMousemove, false);
          // document.removeEventListener('mouseleave', onMousemove, false);
          useGlobalEvent.removeEvent('document', 'mousemove', onMousemove);
          break;
      }
      useGlobalEvent.removeEvent('window', resizeEventName, resizeEvent);
      useGlobalEvent.removeEvent('window', 'scroll', scrollEvent);
    };

    let stopWatchClickOutside = watch(isClickOutside, (newVal: Ref) => {
      // console.log('watch isClickOutside', newVal);
      if (newVal) {
        hide();
      }
    });

    onMounted(() => {
      toggleEl = (dropdownRef.value as HTMLElement).firstElementChild as HTMLElement;
      if (toggleEl) {
        util.addClass(toggleEl, 'dropdown-toggle');
      }
      if (!toggleEl && props.trigger === 'click') {
        return;
      }

      bindEvent();
    });
    onBeforeUnmount(() => {
      offEvent();
      stopWatchClickOutside();
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
      show
    };
  }
});
</script>

<style lang="scss">
@import "bs-dropdown";
</style>
