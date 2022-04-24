<template>
  <div
    class="bs-dropdown dropdown"
    :class="[{'is-disabled': disabled}, `bs-dropdown-direction-${displayDirection}`]"
    ref="dropdownRef">
    <slot></slot>
    <teleport to="body">
      <transition
        name="slide">
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
      left: 0,
      top: 0,
      zIndex: 1000
    });
    let toggleEl: HTMLElement; // 触发下拉菜单显示/隐藏的dom元素
    let eventTimer: number;
    let displayDirection = ref(props.placement);
    let display = computed(function () {
      if (props.destroyDropdownMenuOnHide && !visible.value) {
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
        // 先将下拉菜单的样式清空掉，这样才能更准确的获取下拉菜单的位置、大小等信息
        visible.value = true;
        dropdownMenuStyle.zIndex = nextZIndex();
        if (!loaded.value && visible.value) {
          loaded.value = true;
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

      hide,
      show
    };
  }
});
</script>

<style lang="scss">
@import "bs-dropdown";
</style>
