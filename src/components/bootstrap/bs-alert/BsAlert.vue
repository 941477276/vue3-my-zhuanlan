<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="bs-alert alert"
      :class="[
        `alert-${type}`,
        {
          'alert-dismissible': closeable,
          'has-icon': icon,
          show: closeable && visible
        }
      ]"
      role="alert">
      <BsIcon class="bs-alert-icon" v-if="icon" :name="icon"></BsIcon>
      <div class="bs-alert-content">
        <slot v-if="!description && !$slots.description">{{ title }}</slot>
        <template v-else>
          <dl>
            <dt class="alert-heading">
              <slot>{{ title }}</slot>
            </dt>
            <dd class="alert-description">
              <slot name="description">{{ description }}</slot>
            </dd>
          </dl>
        </template>
      </div>
      <button
        v-if="closeable"
        type="button"
        class="close"
        :class="{
        'custom-close': !!closeText
      }"
        data-dismiss="alert"
        aria-label="Close"
        @click="close">
        <span aria-hidden="true">{{ closeText ? closeText : '&times;' }}</span>
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  PropType
} from 'vue';
import {
  BsColorType
} from '@/ts-tokens/bootstrap';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import {
  isPromise
} from '@/common/bs-util';

export default defineComponent({
  name: 'BsAlert',
  components: {
    BsIcon
  },
  props: {
    type: { // alert的主题类型
      type: String as PropType<BsColorType>,
      default: 'primary'
    },
    closeable: { // 是否可关闭
      type: Boolean,
      default: false
    },
    closeText: { // 关闭按钮文本
      type: String,
      default: ''
    },
    title: { // 标题
      type: String,
      default: ''
    },
    description: { // 辅助性文字。也可通过默认 slot 传入
      type: String,
      default: ''
    },
    icon: { // 图标名称，如果为空则不显示图标
      type: String,
      default: ''
    },
    beforeClose: { // 关闭前的回调，若回调返回false，或返回Promise.reject则不会关闭
      type: Function,
      default: null
    }
  },
  emits: ['close'],
  setup (props: any, ctx: any) {
    let visible = ref(true);

    let close = function () {
      let beforeClose = props.beforeClose;
      if (typeof beforeClose === 'function') {
        let result = beforeClose();
        if (result === false) {
          return;
        } else if (isPromise(result)) {
          result.then(function () {
            visible.value = false;
            ctx.emit('close');
          });
          return;
        }
      }
      visible.value = false;
      ctx.emit('close');
    };
    return {
      visible,

      close
    };
  }
});
</script>

<style lang="scss">
@import "bs-alert";
</style>
