<template>
  <component
    class="btn bs-button"
    :is="tag"
    :type="nativeType"
    :class="btnClass"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    @click="onBtnClick"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @mousewheel="$emit('mousewheel', $event)"
    @contextmenu="$emit('contextmenu', $event)"
    @dblclick="$emit('dblclick', $event)">
    <slot name="loading" v-if="loading">
      <span class="spinner-border" role="status"></span>
    </slot>
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { BsSize, BsColorType, supportedBsColorTypes } from '@/ts-tokens/bootstrap';

type ButtonColorType = BsColorType | 'link';
// 定义按钮支持类型
const nativeTypes = ['button', 'submit'];
const supportedTypes = [...supportedBsColorTypes, 'link'];

export default defineComponent({
  name: 'BsButton',
  props: {
    type: { // 按钮类型
      type: String as PropType<ButtonColorType>,
      default: 'primary',
      validator (typeVal: ButtonColorType) {
        return supportedTypes.includes(typeVal);
      }
    },
    nativeType: { // 原生按钮类型
      type: String,
      default: 'button',
      validator (nativeTypeVal: string) {
        return nativeTypes.includes(nativeTypeVal);
      }
    },
    tag: {
      type: String,
      default: 'button'
    },
    size: { // 按钮大小
      type: String as PropType<BsSize>,
      default: ''
    },
    plain: { // 是否为朴素按钮
      type: Boolean,
      default: false
    },
    block: { // 是否为块级按钮，块级按钮宽占满整个父级
      type: Boolean,
      default: false
    },
    /* round: { // 是否圆角按钮
      type: Boolean,
      default: false
    }, */
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    loading: { // 是否加载中
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'focus', 'blur', 'mouseenter', 'mouseleave', 'mousewheel', 'contextmenu', 'dblclick'],
  setup (props: any, ctx) {
    let btnClass = computed<Array<string|unknown>>(() => {
      let classArr = [];
      let bntType = props.type;

      if (props.plain) {
        classArr.push(`btn-outline-${bntType}`);
      } else {
        classArr.push(`btn-${bntType}`); // 按钮类型的class
      }
      if (props.size) {
        classArr.push(`btn-${props.size}`);
      }
      if (props.block) {
        classArr.push('btn-block');
      }
      /* if (props.round) {
        classArr.push('btn-round');
      } */
      if (props.disabled) {
        classArr.push('is-disabled');
      }
      if (props.loading) {
        classArr.push('is-loading');
      }
      return classArr;
    });
    let onBtnClick = function (evt: MouseEvent): void {
      if (props.disabled) {
        return;
      }
      ctx.emit('click', evt);
    };

    return {
      btnClass,
      onBtnClick
    };
  }
});
</script>

<style lang="scss">
.btn.bs-button{
  &.is-disabled,
  &.is-loading{
    opacity: 0.65;
    cursor: default;
  }
  .spinner-border,
  .spinner-grow{
    width: 1em;
    height: 1em;
    border-width: 0.15em;
    //vertical-align: -0.06em;
    margin-right: 0.4em;
  }
}
</style>
