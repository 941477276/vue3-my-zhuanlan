<template>
  <div
    class="dropdown"
    :class="[directionClass]"
    ref="dropdownRef">
    <slot></slot>
    <ol
      ref="dropdownMenuRef"
      class="dropdown-menu"
      :class="{show: expanded}">
      <li class="dropdown-item" href="#">Action</li>
      <li class="dropdown-item" href="#">Another action</li>
      <li class="dropdown-item" href="#">Something else here</li>
    </ol>
  </div>
</template>

<script lang="ts">
import { ref, PropType, computed, onMounted, onUnmounted, onBeforeUnmount, watch, Ref } from 'vue';
import { util } from '@/common/util';

// 下来菜单显示方向
type directions = 'bottom' | 'top' | 'left' | 'right';
// 触发类型
type triggers = 'click' | 'hover';

const directionOfClass: any = {
  bottom: '',
  top: 'dropup',
  left: 'dropleft',
  right: 'dropright'
};
export default {
  name: 'BsDropdown',
  props: {
    direction: { // 下拉菜单显示方向
      type: String as PropType<directions>,
      default: 'bottom'
    },
    trigger: { // 触发下拉菜单显示的事件
      type: String as PropType<triggers>,
      default: 'click'
    }
  },
  setup (props: any, ctx: any) {
    let expanded = ref(false); // 控制下拉菜单显示/隐藏
    let dropdownRef = ref<HTMLElement|null>(null);
    let dropdownMenuRef = ref<HTMLElement|null>(null);
    let toggleEl: HTMLElement; // 触发下拉菜单显示/隐藏的dom元素

    // 计算下来菜单展示方向的class
    let directionClass = computed<string>(() => {
      return directionOfClass[props.direction];
    });
    let eventTimer: number;
    let isClickOutside = ref(false); // 是否点击了下拉菜单的外卖

    // 显示
    let show = function () {
      clearTimeout(eventTimer);
      eventTimer = setTimeout(() => {
        clearTimeout(eventTimer);
        expanded.value = true;
      }, props.trigger == 'click' ? 0 : 150);
    };
    // 隐藏
    let hide = function () {
      clearTimeout(eventTimer);
      // 鼠标离开trigger el后不立即隐藏下拉菜单，因为有可能鼠标是移动到了下拉菜单本身中
      eventTimer = setTimeout(() => {
        clearTimeout(eventTimer);
        expanded.value = false;
      }, props.trigger == 'click' ? 0 : 150);
    };

    // trigger el点击事件
    let clickEvent = function () {
      expanded.value ? hide() : show();
    };
    // document点击事件，如果不是点击下拉菜单本身，则隐藏当前下拉菜单
    let documentClickEvt = function (evt: MouseEvent) {
      if (!util.elementContains(dropdownRef.value, evt.target)) {
        hide();
      }
    };
    // 绑定事件
    let bindEvent = function () {
      switch (props.trigger) {
        case 'click':
          // console.log('toggle is click');
          toggleEl.addEventListener('click', clickEvent, false);
          document.addEventListener('click', documentClickEvt, false);
          break;
        case 'hover':
          toggleEl.addEventListener('mouseenter', show, false);
          toggleEl.addEventListener('mouseleave', hide, false);
          let dropdownMenuRefEl = dropdownMenuRef.value as HTMLElement;
          dropdownMenuRefEl.addEventListener('mouseenter', show, false);
          dropdownMenuRefEl.addEventListener('mouseleave', hide, false);
          break;
      }
    };
    // 解绑事件
    let offEvent = function () {
      switch (props.trigger) {
        case 'click':
          toggleEl.removeEventListener('click', clickEvent, false);
          document.removeEventListener('click', documentClickEvt, false);
          break;
        case 'hover':
          toggleEl.removeEventListener('mouseenter', show, false);
          toggleEl.removeEventListener('mouseleave', hide, false);
          let dropdownMenuRefEl = dropdownMenuRef.value as HTMLElement;
          dropdownMenuRefEl.removeEventListener('mouseenter', show, false);
          dropdownMenuRefEl.removeEventListener('mouseleave', hide, false);
          break;
      }
    };

    watch(isClickOutside, (newVal: Ref) => {
      if (newVal.value) {
        hide();
      }
    });
    onMounted(() => {
      toggleEl = (dropdownRef.value as HTMLElement).querySelector('.dropdown-toggle') as HTMLElement;
      if (!toggleEl) {
        toggleEl = (dropdownRef.value as HTMLElement).querySelector('[data-toggle="dropdown"]') as HTMLElement;
      }
      if (!toggleEl) {
        return;
      }
      // console.log('toggleEl', toggleEl);
      bindEvent();
    });
    onBeforeUnmount(() => {
      offEvent();
    });

    return {
      expanded,
      dropdownRef,
      dropdownMenuRef,
      directionClass,
      isClickOutside,

      hide,
      show
    };
  }
};
</script>

<style lang="scss">

</style>
