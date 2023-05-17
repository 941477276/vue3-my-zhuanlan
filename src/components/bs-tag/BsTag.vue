<template>
  <transition name="fold">
    <span
      v-show="visible"
      class="bs-tag"
      :class="[
        !color ? `bs-tag-${type || 'primary'}` : '',
        size ? `bs-tag-${size}` : '',
        color ? 'bs-tag-custom-color' : '',
        !color ? `bs-tag--${effect}` : ''
      ]"
      :style="color ? `background-color: ${color}` : null"
      @click="doClick">
    <slot></slot>
    <span
      class="bs-tag-operate"
      v-if="closeable"
      @click.stop="doClose">
      <BsiX class="bs-tag-close"></BsiX>
      <BsiXCircleFill class="bs-tag-close"></BsiXCircleFill>
    </span>
  </span>
  </transition>
</template>

<script lang="ts">
import { BsColorType, supportedBsColorTypes } from '../../ts-tokens/bootstrap';
import {
  defineComponent,
  PropType,
  ref,
  onMounted
} from 'vue';
import { isPromise } from '@vue/shared';
import { BsiX } from 'vue3-bootstrap-icon/es/icons/BsiX';
import { BsiXCircleFill } from 'vue3-bootstrap-icon/es/icons/BsiXCircleFill';

type Effect = 'dark' | 'light' | 'plain';
// type BsTagSize = 'medium' | 'small' | 'mini';
type BsTagSize = 'md' | 'sm' | 'mini';

export default defineComponent({
  name: 'BsTag',
  components: {
    BsiX,
    BsiXCircleFill
  },
  props: {
    type: { // 按钮类型
      type: String as PropType<BsColorType>,
      default: 'primary',
      validator (typeVal: BsColorType) {
        return [...supportedBsColorTypes, 'link'].includes(typeVal);
      }
    },
    size: { // 大小
      type: String as PropType<BsTagSize>,
      default: ''
    },
    effect: { // 主题
      type: String as PropType<Effect>,
      default: 'light'
    },
    closeable: { // 是否可关闭
      type: Boolean,
      default: false
    },
    color: { // 自定义颜色
      type: String,
      default: ''
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let visible = ref(false);

    onMounted(function () {
      visible.value = true;
    });

    let doClose = function () {
      let close = function () {
        visible.value = false;
      };
      let onClose = ctx.attrs.onClose;
      if (typeof onClose === 'function') {
        let res = onClose();
        if (res === false) {
          return;
        } else if (isPromise(res)) {
          res.then(close);
          return;
        }
      }
      close();
    };

    let doClick = function () {
      ctx.emit('click');
    };

    return {
      visible,

      show () {
        visible.value = true;
      },
      doClose,
      doClick
    };
  }
});
</script>
