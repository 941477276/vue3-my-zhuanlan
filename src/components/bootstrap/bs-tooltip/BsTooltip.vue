<template>
  <BsPopper>
    <BsTooltipTrigger
      :virtual-triggering="virtualTriggering"
      :virtual-ref="virtualRef"
      :disabled="disabled"
      :trigger="trigger"
      :enterable="enterable">
      <slot v-if="$slots.default"></slot>
    </BsTooltipTrigger>

    <BsTooltipContent
      ref="tooltipContentComRf"
      v-bind="$attrs"
      :id="tooltipId"
      :teleported="teleported"
      :append-to="appendTo"
      :popper-class="popperClassInner"
      :visible="isShow"
      :placement="placement"
      :arrow-offset="arrowOffset"
      :popper-options="popperOptions"
      :popper-style="popperStyle"
      :offset="offset"
      :z-index="zIndex"
      :strategy="strategy"
      :disabled="disabled"
      :enterable="enterable"
      :destroy-on-hide="destroyOnHide"
      :transition-name="transitionName"
      :gpu-acceleration="transitionName === 'scale' ? false : gpuAcceleration">
      <slot name="content">
        <div v-if="!rawContent">
          {{ content }}
        </div>
        <div v-else v-html="content"></div>
      </slot>

      <BsPopperArrow
        v-if="showArrow"
        :arrow-class="arrowClass"></BsPopperArrow>
    </BsTooltipContent>
  </BsPopper>
</template>

<script lang="ts">
import {
  cloneVNode,
  defineComponent,
  PropType,
  computed,
  ref,
  provide,
  toRef,
  readonly,
  watch
} from 'vue';
import {
  PopperTriggerType,
  BsTooltipContext,
  bsTooltipContextKey
} from '@/ts-tokens/bootstrap/popper';
import BsPopper from '../bs-popper/BsPopper.vue';
// import BsPopperTrigger from '../bs-popper/BsPopperTrigger.vue';
// import BsPopperContent from '../bs-popper/BsPopperContent.vue';
import BsPopperArrow from '../bs-popper/BsPopperArrow.vue';
import { bsPopperContentProps } from '../bs-popper/bs-popper-content-props';
import { bsTooltipContentProps } from './bs-tooltip-content-props';
import { bsTooltipTriggerProps } from './bs-tooltip-trigger-props';
import { bsTooltipProps } from './bs-tooltip-props';
import BsTooltipContent from './BsTooltipContent.vue';
import BsTooltipTrigger from './BsTooltipTrigger.vue';

let tooltipCount = 0;
export default defineComponent({
  name: 'BsTooltip',
  components: {
    BsPopper,
    // BsPopperTrigger,
    // BsPopperContent,
    BsPopperArrow,
    BsTooltipContent,
    BsTooltipTrigger
  },
  props: {
    ...bsPopperContentProps,
    ...bsTooltipContentProps,
    ...bsTooltipTriggerProps,
    ...bsTooltipProps,
    pure: { // 是否为纯净的tooltip，如果是纯净的则会添加 bs-tooltip class类名
      type: Boolean,
      default: true
    },
    themeClass: { // 自定义主题class
      type: String,
      default: ''
    },
    showCondition: { // 显示时的条件
      type: Function,
      default: null
    },
    hideCondition: { // 隐藏时的条件
      type: Function,
      default: null
    }
  },
  emits: ['before-show', 'before-hide', 'content-mouseenter', 'content-mouseleave', 'show', 'hide'],
  setup (props: any, ctx: any) {
    let tooltipContentComRf = ref(null);
    let popperClassInner = computed(function () {
      if (!props.pure) {
        return props.popperClass;
      }
      return [
        'bs-tooltip',
        props.theme === 'custom' ? props.themeClass : `is-${props.theme}`,
        props.popperClass
      ];
    });
    let tooltipId = ref(props.id || `tooltip_${++tooltipCount}`);

    // 判断popper是否被外部控制，如果外部传递的 visible prop 变量值为boolean类型则认为被外部控制了
    let isControlled = computed(function () {
      return typeof props.visible === 'boolean';
    });

    let isShow = ref(false);

    let showTimer: number;
    let hideTimer: number;

    // 显示
    let show = function () {
      if (props.disabled || isControlled.value) {
        return;
      }
      let showCondition = props.showCondition;
      if (typeof showCondition === 'function') {
        let flag = showCondition();
        if (flag === false) {
          return;
        }
      }
      // 每次显示或隐藏时都清除两个定时器，这样当trigger类型为hover时就可以实现鼠标可以移入popper的效果
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      showTimer = setTimeout(function () {
        isShow.value = true;
      }, props.showDelay);
    };

    // 隐藏
    let hide = function () {
      if (props.disabled || isControlled.value) {
        return;
      }
      let hideCondition = props.hideCondition;
      if (typeof hideCondition === 'function') {
        let flag = hideCondition();
        if (flag === false) {
          return;
        }
      }
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      hideTimer = setTimeout(function () {
        isShow.value = false;
      }, props.hideDelay);
    };

    // 更新popper位置
    let updatePopper = function (updateZIndex: boolean) {
      if (tooltipContentComRf.value) {
        (tooltipContentComRf.value as any).updatePopper?.(updateZIndex);
      }
    };

    watch(() => props.visible, function (visibleVal: boolean) {
      if (isControlled.value) {
        isShow.value = visibleVal;
      }
    }, { immediate: true });

    provide<BsTooltipContext>(bsTooltipContextKey, {
      show,
      hide,
      onBeforeShow: () => {
        ctx.emit('before-show');
      },
      onShow: () => {
        ctx.emit('show');
      },
      onBeforeHide: () => {
        ctx.emit('before-hide');
      },
      onHide: () => {
        ctx.emit('hide');
      },
      onContentMouseenter: () => {
        ctx.emit('content-mouseenter');
      },
      onContentMouseleave: () => {
        ctx.emit('content-mouseleave');
      },
      trigger: toRef(props, 'trigger'),
      isShow: readonly(isShow),
      isControlled
    });

    return {
      popperClassInner,
      isShow,
      tooltipId,
      tooltipContentComRf,

      show,
      hide,
      updatePopper
    };
  }
});
</script>

<style lang="scss">
@import "bs-tooltip";
</style>
