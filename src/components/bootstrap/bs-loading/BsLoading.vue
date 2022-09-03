<template>
  <transition
    :name="transitionName"
    @after-leave="$emit('after-leave')">
    <div
      v-show="visible"
      class="bs-loading"
      :class="{
        'horizontal-align': !vertical,
        'is-fullscreen': fullscreen
      }"
      :style="{
        'background-color': maskBackground
      }">
      <div
        class="bs-loading-content"
        :style="{ color: textColor }">
        <slot name="spinner">
          <BsSpinner
            :text="text"
            :grow="grow"></BsSpinner>
        </slot>
        <div class="bs-loading-text" v-if="text || $slots.default">
          <slot>{{ text }}</slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onUnmounted
} from 'vue';
import BsSpinner from '../bs-spinner/BsSpinner.vue';
import { supportedBsColorTypes } from '@/ts-tokens/bootstrap';

export default defineComponent({
  name: 'BsLoading',
  components: {
    BsSpinner
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    grow: { // 是否为增长式旋转器
      type: Boolean,
      default: false
    },
    vertical: { // 是否垂直对齐
      type: Boolean,
      default: false
    },
    color: { // 字体颜色
      type: String,
      default: ''
    },
    background: { // 背景色
      type: String,
      default: ''
    },
    transitionName: { // 过渡效果名称
      type: String,
      default: 'fade'
    },
    fullscreen: { // 是否全屏
      type: Boolean,
      default: false
    }
  },
  emits: ['destroy', 'after-leave'],
  setup (props: any, ctx: any) {
    let textColor = computed(function () {
      let color = props.color;
      if (!color) {
        return '';
      }
      if (supportedBsColorTypes.includes(color)) {
        return `var(--${color})`;
      }
      return color;
    });

    let maskBackground = computed(function () {
      let bg = props.background;
      if (!bg) {
        return '';
      }
      if (supportedBsColorTypes.includes(bg)) {
        return `var(--${bg})`;
      }
      return bg;
    });

    onUnmounted(function () {
      ctx.emit('destroy');
    });

    return {
      textColor,
      maskBackground
    };
  }
});
</script>

<style lang="scss">
.bs-loading{
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  opacity: 0.85;
  background-color: #fff;
  transition: background-color .2s, opacity .2s;
  &.fade-enter-from,
  &.fade-leave-to{
    opacity: 0;
  }
  &.fade-leave-from,
  &.fade-enter-to{
    opacity: 0.85;
  }
  &.is-fullscreen{
    position: fixed;
  }
  &.horizontal-align{
    .bs-loading-content {
      display: flex;
      align-items: center;
      .bs-loading-text{
        //margin: 0 0 0 0.75rem;
        margin-left: 0.75rem;
      }
    }
  }
  .spinner-border{
    border-width: 0.125rem;
  }
}
.bs-loading-content{
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--primary);
}
.bs-loading-text{
  margin-top: 0.25rem;
}
</style>
