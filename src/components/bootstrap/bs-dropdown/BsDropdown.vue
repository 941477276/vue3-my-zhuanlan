<template>
  <div
    class="bs-dropdown dropdown"
    :class="[directionClass, {'is-disabled': disabled}]"
    ref="dropdownRef">
    <slot></slot>
    <ol
      ref="dropdownMenuRef"
      class="dropdown-menu"
      :class="{show: expanded}"
      :style="styleText">
      <slot name="dropdown-item"></slot>
    </ol>
  </div>
</template>

<script lang="ts">
import { ref, PropType, defineComponent, onMounted, nextTick, onBeforeUnmount, watch, Ref } from 'vue';
import { util } from '@/common/util';
import { useClickOutside } from '@/hooks/useClickOutside';

// 下来菜单显示方向
type directions = 'bottom' | 'top' | 'left' | 'right';
// 触发类型
type triggers = 'click' | 'hover';
interface calcDirection {
  left: number,
  top: number,
  vertical: boolean,
  horizontal: boolean,
  direction: directions
}

const directionOfClass: any = {
  bottom: '',
  top: 'dropup',
  left: 'dropleft',
  right: 'dropright'
};
export default defineComponent({
  name: 'BsDropdown',
  props: {
    direction: { // 下拉菜单显示方向
      type: String as PropType<directions>,
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
      default: 'click'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let expanded = ref(false); // 控制下拉菜单显示/隐藏
    let dropdownRef = ref<HTMLElement|null>(null);
    let dropdownMenuRef = ref<HTMLElement|null>(null);
    let toggleEl: HTMLElement; // 触发下拉菜单显示/隐藏的dom元素

    // 计算下拉菜单展示方向的class
    let directionClass = ref<string>('');
    let styleText = ref<string>('');
    let eventTimer: number;

    let isClickOutside = useClickOutside(dropdownRef); // 是否点击了下拉菜单的外面

    watch(() => props.direction, (newDirection: directions) => {
      directionClass.value = directionOfClass[newDirection];
    }, { immediate: true });

    // 计算显示方向
    let calcDirection = function (currentDirection: directions): calcDirection {
      let toggleElReact: DOMRect = toggleEl.getBoundingClientRect();
      let dropdownMenuOffset = util.offset(dropdownMenuRef.value);
      let dropdownMenuWidth = (dropdownMenuRef.value as HTMLElement).offsetWidth;
      let dropdownMenuHeight = (dropdownMenuRef.value as HTMLElement).offsetHeight;

      let tryReverseDirection = props.tryReverseDirection;
      let tryAllDirection = props.tryAllDirection;
      let calcedDirection: calcDirection|null = null;
      let directionCalcFlow = []; // 存储按流程计算方向的函数，当下拉菜单在某个方向上不能完全展示时会自动切换一个方向
      let handleBottom = function (): calcDirection {
        let offsetTop = dropdownMenuOffset.top + dropdownMenuHeight;
        let offsetLeft = dropdownMenuOffset.left + dropdownMenuWidth;
        let isInView = util.eleInView(dropdownMenuRef.value, offsetTop, offsetLeft);
        console.log('handleBottom isInView', isInView);
        return {
          vertical: isInView.vertical,
          horizontal: isInView.horizontal,
          direction: 'bottom',
          left: 0,
          top: toggleElReact.height
        };
      };
      let handleTop = function (): calcDirection {
        let offsetTop = dropdownMenuOffset.top - (toggleElReact.height + dropdownMenuHeight);
        let offsetLeft = dropdownMenuOffset.left + dropdownMenuWidth;
        let isInView = util.eleInView(dropdownMenuRef.value, offsetTop, offsetLeft);
        console.log('handleTop isInView', isInView);
        return {
          vertical: isInView.vertical,
          horizontal: isInView.horizontal,
          direction: 'top',
          left: 0,
          top: -(toggleElReact.height + dropdownMenuHeight)
        };
      };
      let handleLeft = function (): calcDirection {
        let offsetTop = dropdownMenuOffset.top;
        let offsetLeft = dropdownMenuOffset.left - dropdownMenuWidth;
        let isInView = util.eleInView(dropdownMenuRef.value, offsetTop, offsetLeft);
        console.log('handleTop handleLeft', isInView);
        return {
          vertical: isInView.vertical,
          horizontal: isInView.horizontal,
          direction: 'left',
          left: -dropdownMenuWidth,
          top: 0
        };
      };
      let handleRight = function (): calcDirection {
        let newTop = dropdownMenuOffset.top;
        let newLeft = dropdownMenuOffset.left + dropdownMenuWidth;
        let isInView = util.eleInView(dropdownMenuRef.value, newTop, newLeft);
        console.log('handleTop handleRight', isInView);
        return {
          vertical: isInView.vertical,
          horizontal: isInView.horizontal,
          direction: 'right',
          left: dropdownMenuWidth,
          top: 0
        };
      };
      switch (currentDirection) {
        case 'bottom':
          directionCalcFlow.push(handleBottom);
          if (tryReverseDirection || tryAllDirection) {
            directionCalcFlow.push(handleTop);
          }
          if (tryAllDirection) {
            directionCalcFlow.push(handleLeft);
            directionCalcFlow.push(handleRight);
          }
          break;
        case 'top':
          directionCalcFlow.push(handleTop);
          if (tryReverseDirection || tryAllDirection) {
            directionCalcFlow.push(handleBottom);
          }
          if (tryAllDirection) {
            directionCalcFlow.push(handleLeft);
            directionCalcFlow.push(handleRight);
          }
          break;
        case 'left':
          directionCalcFlow.push(handleLeft);
          if (tryReverseDirection || tryAllDirection) {
            directionCalcFlow.push(handleRight);
          }
          if (tryAllDirection) {
            directionCalcFlow.push(handleBottom);
            directionCalcFlow.push(handleTop);
          }
          break;
        case 'right':
          directionCalcFlow.push(handleRight);
          if (tryReverseDirection || tryAllDirection) {
            directionCalcFlow.push(handleLeft);
          }
          if (tryAllDirection) {
            directionCalcFlow.push(handleBottom);
            directionCalcFlow.push(handleTop);
          }
          break;
      }

      // 寻找元素在水平、垂直方向都完全出现在视口中的方向
      directionCalcFlow.some(function (calcFn) {
        let result = calcFn();
        let inView = result.vertical && result.horizontal;
        if (inView) {
          calcedDirection = result;
        }
        return inView;
      });
      console.log('calcedDirection', calcedDirection);

      if (!calcedDirection && tryAllDirection) {
        // 寻找元素在水平或垂直方向都有一个地方完全出现在视口中的方向，因为可能出现除currentDirection外的其他3个方向都无法完全出现在视口的情况
        directionCalcFlow.some(function (calcFn) {
          let result = calcFn();
          let inView = result.vertical || result.horizontal;
          if (inView) {
            calcedDirection = result;
          }
          return inView;
        });
      }
      if (!calcedDirection) {
        let handleMap = {
          top: handleTop,
          left: handleLeft,
          bottom: handleBottom,
          right: handleRight
        };
        calcedDirection = handleMap[currentDirection]();
      }
      return calcedDirection;
    };
    // 显示
    let show = function () {
      clearTimeout(eventTimer);
      eventTimer = setTimeout(() => {
        clearTimeout(eventTimer);
        // 先将下拉菜单的样式清空掉，这样才能更准确的获取下拉菜单的位置、大小等信息
        styleText.value = 'opacity: 0;';
        directionClass.value = '';
        expanded.value = true;

        nextTick(() => {
          let directionInfo = calcDirection(props.direction);
          console.log('directionInfo', directionInfo);
          directionClass.value = directionOfClass[props.direction];
          switch (directionInfo.direction) {
            case 'bottom':
              styleText.value = `position:absolute;transform:translate3d(${directionInfo.left}px, ${directionInfo.top}px, 0);opacity:1;top:0;left:0;bottom:auto;`;
              break;
            case 'top':
              styleText.value = `position:absolute;transform:translate3d(${directionInfo.left}px, ${directionInfo.top}px, 0);opacity:1;top:auto;left:0;bottom:auto;`;
              break;
            case 'left':
              styleText.value = `position:absolute;transform:translate3d(${directionInfo.left}px, ${directionInfo.top}px, 0);opacity:1;top:0;left:0;right:auto;`;
              break;
            case 'right':
              styleText.value = `position:absolute;transform:translate3d(${directionInfo.left}px, ${directionInfo.top}px, 0);opacity:1;top:0;left:auto;right:0;`;
              break;
          }
        });
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

    // 绑定事件
    let bindEvent = function () {
      switch (props.trigger) {
        case 'click':
          // console.log('toggle is click');
          toggleEl.addEventListener('click', clickEvent, false);
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
      console.log('watch isClickOutside', newVal);
      if (newVal) {
        hide();
      }
    });
    watch(() => props.disabled, (disabled: boolean) => {
      if (disabled) {
        offEvent();
      } else {
        bindEvent();
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
      // console.log('toggleEl', toggleEl);
      if (props.disabled) {
        return;
      }
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
      styleText,

      hide,
      show
    };
  }
});
</script>

<style lang="scss">
.bs-dropdown{
  display: inline-block;
  vertical-align: middle;
  &.is-disabled{
    opacity: 0.65;
    cursor: default;
    pointer-events: none;
  }
  .dropdown-menu{
    margin: 0;
  }
}
</style>
