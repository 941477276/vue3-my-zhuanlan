<template>
  <div
    class="bs-dropdown dropdown"
    :class="[{'is-disabled': disabled}, `bs-dropdown-direction-${displayDirection}`]"
    ref="dropdownRef">
    <BsOnlyChild>
      <slot></slot>
    </BsOnlyChild>
    <teleport :disabled="!teleported" :to="appendTo">
      <BsDropdownTransition
        v-if="display"
        @before-enter="transitionLeaveDone = false"
        @after-leave="transitionLeaveDone = true"
        :will-visible="willVisible"
        :placement="placement"
        :reference-ref="triggerRef">
        <div
          v-show="visible"
          ref="dropdownMenuRef"
          class="bs-dropdown-menu dropdown-menu"
          :class="dropdownClass"
          :style="{
            zIndex: dropdownMenuStyle.zIndex
          }"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave">
          <slot name="content"></slot>
        </div>
      </BsDropdownTransition>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch,
  Ref,
  computed
} from 'vue';
import BsOnlyChild from '../bs-slot/BsOnlyChild.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import {
  addClass,
  removeClass,
  eleIsInFixedParents
} from '@/common/bs-util';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  bsDropdownProps
} from './props';
import {
  useZIndex
} from '@/hooks/useZIndex';
import {
  useForwardRef
} from '@/hooks/useForwardRef';

// 下来菜单显示方向
type directions = 'bottom' | 'top' | 'left' | 'right';

export default defineComponent({
  name: 'BsDropdown',
  components: {
    BsOnlyChild,
    BsDropdownTransition
  },
  props: {
    ...bsDropdownProps
  },
  emits: ['show', 'hide'],
  setup (props: any, ctx: any) {
    let loaded = ref(false);
    let visible = ref(false);
    let willVisible = ref(false);
    // 触发元素
    let triggerRef = ref<HTMLElement|null>(null);
    useForwardRef(triggerRef);

    let dropdownRef = ref<HTMLElement|null>(null);
    let dropdownMenuRef = ref<HTMLElement|null>(null);
    let dropdownMenuStyle = reactive({
      position: 'absolute',
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
        let doShow = function () {
          visible.value = true;
          if (props.teleported && props.appendTo === 'body') {
            dropdownMenuStyle.zIndex = nextZIndex() + '';
          }

          /* let toggleElIsInFixedContainer = eleIsInFixedParents(toggleEl as HTMLElement);
          if (toggleElIsInFixedContainer && props.teleported) {
            dropdownMenuStyle.position = 'fixed';
          } else {
            dropdownMenuStyle.position = 'absolute';
          } */

          ctx.emit('show');
        };

        if (!loaded.value) {
          loaded.value = true;
          nextTick(function () {
            // willVisible必须比visible先行，以能确保dropdown-transition组件正确的计算过渡动画名称
            willVisible.value = true;
            // 第一次的时候需等待dom初始化完成再显示出来
            let timer = setTimeout(function () {
              clearTimeout(timer);
              doShow();
            }, 20);
          });
        } else {
          let timer = setTimeout(function () {
            clearTimeout(timer);
            doShow();
          }, 0);
        }
      }, props.trigger == 'click' ? 0 : 150);
    };
    // 隐藏
    let hide = function (delayTime = 0) {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      // 鼠标离开trigger el后不立即隐藏下拉菜单，因为有可能鼠标是移动到了下拉菜单本身中
      hideTimer = setTimeout(() => {
        clearTimeout(hideTimer);
        willVisible.value = false;
        visible.value = false;
        if (props.destroyDropdownMenuOnHide) {
          loaded.value = false;
        }
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

    let stopWatchClickOutside = watch(isClickOutside, (newVal: Ref) => {
      // console.log('watch isClickOutside', newVal);
      if (newVal) {
        hide();
      }
    });

    watch(() => triggerRef.value, (triggerEl) => {
      toggleEl = triggerEl;
      if (triggerEl) {
        if (props.showDropdownToggleArrow) {
          addClass(triggerEl, 'dropdown-toggle');
        }
        triggerEl.addEventListener('click', clickEvent, false);
        triggerEl.addEventListener('mouseenter', onMouseEnter, false);
        triggerEl.addEventListener('mouseleave', onMouseLeave, false);
      }
    }, { immediate: true });

    watch([() => props.showToggleArrow, triggerRef], function ([isShow, triggerEl]) {
      console.log('isShow', isShow, triggerEl);
      if (!triggerEl) {
        return;
      }
      if (isShow) {
        addClass(triggerEl, 'dropdown-toggle');
      } else {
        removeClass(triggerEl, 'dropdown-toggle');
      }
    });

    onBeforeUnmount(() => {
      stopWatchClickOutside();
      toggleEl = null;
    });

    return {
      display,
      visible,
      willVisible,
      loaded,
      dropdownRef,
      dropdownMenuRef,
      isClickOutside,
      dropdownMenuStyle,
      displayDirection,
      transitionLeaveDone,
      triggerRef,

      hide,
      show,
      onMouseEnter,
      onMouseLeave
      // onDropdownMouseenter,
      // onDropdownMouseleave,
    };
  }
});
</script>

<style lang="scss">
@import "bs-dropdown";
</style>
