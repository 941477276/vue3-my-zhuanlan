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
      :gpu-acceleration="gpuAcceleration">
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
    showArrow: { // 是否显示三角箭头
      type: Boolean,
      default: true
    },
    arrowClass: { // 三角箭头的class
      type: String,
      default: ''
    },
    virtualTriggering: { // 是否由虚拟元素触发
      type: Boolean,
      default: false
    },
    virtualRef: { // 触发元素的ref
      type: [String, Function, Object],
      default: null
    },
    showDelay: { // 延迟出现，单位毫秒
      type: Number,
      default: 100
    },
    hideDelay: { // 延迟关闭，单位毫秒
      type: Number,
      default: 200
    },
    pure: { // 是否为纯净的tooltip，如果是纯净的则会添加 bs-tooltip class类名
      type: Boolean,
      default: true
    }
  },
  emits: ['before-show', 'before-hide', 'content-mouseenter', 'content-mouseleave', 'show', 'hide'],
  setup (props: any, ctx: any) {
    let popperClassInner = computed(function () {
      if (!props.pure) {
        return props.popperClass;
      }
      return [
        'bs-tooltip',
        {
          'is-dark': props.theme === 'dark',
          'is-light': props.theme === 'light'
        },
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
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      hideTimer = setTimeout(function () {
        isShow.value = false;
      }, props.hideDelay);
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

      show,
      hide
    };
  }
});
</script>

<style lang="scss">
@import "bs-tooltip";
</style>
