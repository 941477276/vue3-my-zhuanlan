<template>
  <component
    class="btn bs-button"
    :is="tag"
    :type="nativeType"
    :class="btnClass"
    :disabled="disabled || loading || null"
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
      default: '',
      validator (typeVal: ButtonColorType) {
        if (!typeVal) {
          return true;
        }
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
    round: { // 是否圆角按钮
      type: Boolean,
      default: false
    },
    squared: { // 是否平角按钮
      type: Boolean,
      default: false
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    loading: { // 是否加载中
      type: Boolean,
      default: false
    },
    dropdownToggle: { // 是否为下拉菜单切换按钮
      type: Boolean,
      default: false
    },
    showToggleSplit: { // 是否为显示下拉菜单切换按钮分割线
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'focus', 'blur', 'mouseenter', 'mouseleave', 'mousewheel', 'contextmenu', 'dblclick'],
  setup (props: any, ctx) {
    let btnClass = computed<Array<string|unknown>>(() => {
      let classArr = [];
      let bntType = props.type;

      if (bntType) {
        if (props.plain) {
          classArr.push(`btn-outline-${bntType}`);
          if (!bntType) {
            classArr.push('btn-outline-default');
          }
        } else {
          classArr.push(`btn-${bntType}`); // 按钮类型的class
        }
      }

      if (props.size) {
        classArr.push(`btn-${props.size}`);
      }
      if (props.block) {
        classArr.push('btn-block');
      }
      if (props.round) {
        classArr.push('rounded-pill');
      }
      if (props.squared) {
        classArr.push('rounded-0');
      }
      if (props.disabled) {
        classArr.push('disabled');
      }
      if (props.loading) {
        classArr.push('is-loading');
      }
      if (props.dropdownToggle) {
        classArr.push('dropdown-toggle');
      }
      if (props.showToggleSplit) {
        classArr.push('dropdown-toggle-split');
      }
      return classArr;
    });
    let onBtnClick = function (evt: MouseEvent): void {
      if (props.disabled || props.loading) {
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
.bs-button{
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
/*.bs-button:not(.btn-block){
  & + .bs-button:not(.btn-block){
    margin-left: 0.625rem;
  }
}*/
</style>
