<template>
  <transition name="fold">
    <span
      v-show="show"
      class="bs-tag"
      :class="[
        `bs-tag-${type || 'primary'}`,
        size ? `bs-tag-${size}` : '',
        `bs-tag--${effect}`
      ]"
      @click="doClick">
    <slot></slot>
    <span
      class="bs-tag-operate"
      v-if="closeable"
      @click.stop="doClose">
      <BsIcon class="bs-tag-close" name="x"></BsIcon>
      <BsIcon class="bs-tag-close" name="x-circle-fill"></BsIcon>
    </span>
  </span>
  </transition>

</template>

<script lang="ts">
import { BsColorType, supportedBsColorTypes } from '@/ts-tokens/bootstrap';
import {
  defineComponent,
  PropType,
  ref,
  onMounted
} from 'vue';
import BsIcon from '../bs-icon/BsIcon.vue';

type Effect = 'dark' | 'light' | 'plain';
// type BsTagSize = 'medium' | 'small' | 'mini';
type BsTagSize = 'md' | 'sm' | 'mini';

export default defineComponent({
  name: 'BsTag',
  components: {
    BsIcon
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
    hit: { // 是否有边框描边
      type: Boolean,
      default: false
    },
    beforeClose: { // 标签关闭前触发的事件，如果函数返回false，则不会关闭
      type: Function,
      default: null
    }
  },
  emit: ['close', 'click'],
  setup (props: any, ctx: any) {
    let show = ref(false);

    onMounted(function () {
      show.value = true;
    });

    let doClose = function () {
      let beforeClose = props.beforeClose;
      if (typeof beforeClose === 'function') {
        let res = beforeClose();
        if (res === false) {
          return;
        }
      }
      show.value = false;
      ctx.emit('close');
    };

    let doClick = function () {
      ctx.emit('click');
    };

    return {
      show,
      doClose,
      doClick
    };
  }
});
</script>

<style lang="scss">
@import "bs-tag";
</style>
