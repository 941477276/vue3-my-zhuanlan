<template>
<div
  class="bs-switch"
  :class="[{
    'bs-switch-loading': loading,
    'bs-switch-open': isOpen,
    'bs-switch-disabled': disabled
  }, size ? `bs-switch-${size}` : '']">
  <input
    ref="switchInputRef"
    :name="null"
    :disabled="disabled || loading"
    type="checkbox"
    class="bs-switch-hidden-input" />
  <div
    class="bs-switch-inner"
    :class="{
      'has-inactive-color': inactiveColor
    }"
    :style="switchInnerStyle"
    @click="switchClick">
    <span class="bs-switch-text">
      {{ isOpen ? activeText : inactiveText }}
    </span>
    <div class="switch-circle">
      <div class="switch-loading" v-if="loading">
        <div class="spinner-border" :class="`text-${loadingColorType}`" role="status">
          <span class="sr-only">Switch Loading...</span>
        </div>
      </div>
    </div>
    <div v-if="disabled" class="switch-disabled-box"></div>
  </div>
</div>
</template>

<script lang="ts">
import {
  ref,
  PropType,
  defineComponent,
  computed,
  watch,
  nextTick,
  onUnmounted,
  inject
} from 'vue';
import {
  BsColorType,
  BsSize,
  FormItemContext,
  formItemContextKey
} from '../../ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsSwitch',
  props: {
    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    colorType: { // 背景色
      type: String as PropType<BsColorType>,
      default: ''
    },
    loadingColorType: { // 加载中旋转图标的颜色
      type: String as PropType<BsColorType>,
      default: 'primary'
    },
    activeValue: { // switch 打开时的值
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: { // switch  关闭时的值
      type: [Boolean, String, Number],
      default: false
    },
    activeText: { // switch 打开时的文字描述
      type: String,
      default: ''
    },
    inactiveText: { // switch  关闭时的文字描述
      type: String,
      default: ''
    },
    activeColor: { // switch 打开时的背景色
      type: String,
      default: ''
    },
    inactiveColor: { // switch 关闭时的背景色
      type: String,
      default: ''
    },
    size: { // 大小
      type: String as PropType<BsSize>,
      default: ''
    },
    name: { // switch 对应的 name 属性
      type: String,
      default: null
    },
    extraData: { // 额外数据，调用beforeChange时会传递进去
      default: null
    },
    beforeChange: { // switch状态改变前的回调函数，如果返回false或promise.reject则不会改变
      type: Function,
      default: null
    },
    validateEvent: { // 改变 switch 状态时是否触发表单的校验
      type: Boolean,
      default: true
    }
  },
  emit: ['update:modelValue', 'change', 'click'],
  setup (props: any, ctx: any) {
    let switchInputRef = ref<HTMLInputElement|null>(null);
    // 是否打开
    let isOpen = computed(function () {
      return props.modelValue === props.activeValue;
    });

    let stopWatch = watch(isOpen, function (isOpenVal) {
      nextTick(function () {
        (switchInputRef.value as HTMLInputElement).checked = isOpenVal;
      });
    }, { immediate: true });

    // 计算 .bs-switch-inner 的样式
    let switchInnerStyle = computed(function () {
      let opened = isOpen.value;
      let colorType = '';
      if (props.colorType && opened) {
        colorType = `background-color: var(--${props.colorType});border-color: var(--${props.colorType})`;
      }
      let activeColor = '';
      if (props.activeColor && opened) {
        activeColor = `background-color: ${props.activeColor};border-color: ${props.activeColor}`;
      }
      let inActiveColor = props.inactiveColor ? `--inactive-color: ${props.inactiveColor}` : '';
      let result = activeColor;
      if (!activeColor) {
        result = colorType;
      }
      if (result) {
        result += '; ' + inActiveColor;
      } else {
        result = inActiveColor;
      }
      return result;
    });

    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);

    // 开关点击事件
    let switchClick = function () {
      if (props.disabled || props.loading) {
        return;
      }
      let val = isOpen.value ? props.inactiveValue : props.activeValue;
      let beforeChange = props.beforeChange;
      let changeVal = function () {
        ctx.emit('update:modelValue', val);
        ctx.emit('change', val);
        // 调用<bs-form-item>组件，触发数据校验
        if (props.validateEvent && formItemContext) {
          formItemContext.validate('change');
        }
      };
      ctx.emit('click');
      if (typeof beforeChange === 'function') {
        let result = beforeChange(val, props.extraData);
        if (result === false) {
          return;
        }
        // 返回值为promise
        if (typeof result === 'object' && typeof result.then === 'function') {
          result.then(changeVal);
          return;
        }
        // 返回其他值也更新数据
        changeVal();
      }
      changeVal();
    };

    onUnmounted(function () {
      stopWatch();
    });

    return {
      switchInputRef,
      isOpen,
      switchInnerStyle,

      switchClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-switch";
</style>
