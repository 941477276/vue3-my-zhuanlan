<template>
<div
  class="bs-switch"
  :class="{
    'bs-switch-loading': loading,
    'bs-switch-open': isOpen,
    'is-disabled': disabled
  }">
  <input
    ref="switchInputRef"
    :name="null"
    :disabled="disabled || loading"
    type="checkbox"
    class="bs-switch-hidden-input" />
  <div class="bs-switch-inner" @click="switchClick">
    <span class="bs-switch-text">开</span>
    <div class="switch-loading-box" v-if="loading" @click.stop="switchLoadingBoxClick">
      <div class="spinner-border" :class="`text-${loadingColorType}`" role="status">
        <span class="sr-only">Switch Loading...</span>
      </div>
    </div>
    <div class="switch-disabled-box"></div>
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
  onUnmounted
} from 'vue';
import {
  BsColorType
} from '@/ts-tokens/bootstrap';

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
    loadingColorType: { // 加载中旋转图标的颜色
      type: String as PropType<BsColorType>,
      default: 'primary'
    },
    activeValue: { // switch 打开时的值
      type: [Boolean, String, Number],
      default: true
    },
    inActiveValue: { // switch  关闭时的值
      type: [Boolean, String, Number],
      default: false
    },
    activeText: { // switch 打开时的文字描述
      type: String,
      default: ''
    },
    inActiveText: { // switch  关闭时的文字描述
      type: String,
      default: ''
    },
    activeColor: { // switch 打开时的文字描述
      type: String,
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
    }
  },
  emit: ['update:modelValue', 'change', 'click'],
  setup (props: any, ctx: any) {
    let switchInputRef = ref<HTMLInputElement|null>(null);
    let isOpen = computed(function () {
      return props.modelValue === props.activeValue;
    });

    let stopWatch = watch(isOpen, function (isOpenVal) {
      nextTick(function () {
        (switchInputRef.value as HTMLInputElement).checked = isOpenVal;
      });
    }, { immediate: true });

    let switchClick = function () {
      if (props.disabled || props.loading) {
        return;
      }
      let val = isOpen.value ? props.inActiveValue : props.activeValue;
      let beforeChange = props.beforeChange;
      let changeVal = function () {
        ctx.emit('update:modelValue', val);
        ctx.emit('change', val);
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
    let switchLoadingBoxClick = function () {
    // 这个函数只需阻止冒泡即可
    };

    onUnmounted(function () {
      stopWatch();
    });

    return {
      switchInputRef,
      isOpen,

      switchClick,
      switchLoadingBoxClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-switch";
</style>
