<template>
  <transition name="fold">
    <span
      v-if="show"
      class="bs-tag"
      :class="[
      `bs-tag-${type || 'primary'}`,
      size ? `bs-tag-${size}` : '',
      `bs-tag--${effect}`
    ]">
    <slot></slot>
    <span class="bs-tag-operate" v-if="closeable">
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
type BsTagSize = 'medium' | 'small' | 'mini'
const tagSupportedBsColorTypes = [...supportedBsColorTypes];
tagSupportedBsColorTypes.pop();

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
        return tagSupportedBsColorTypes.includes(typeVal);
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
    }
  },
  setup () {
    let show = ref(false);

    onMounted(function () {
      show.value = true;
    });

    return {
      show
    };
  }
});
</script>

<style lang="scss">
@import "bs-tag";
</style>
