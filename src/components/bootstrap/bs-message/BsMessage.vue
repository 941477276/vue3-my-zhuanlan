<template>
  <transition
    name="message_fade"
    @after-leave="$emit('destroy')">
    <div
      v-show="visible"
      v-bind="$attrs"
      class="bs-message"
      :class="[
        `bs-message-${type}`,
        customClass,
        {
          'bs-message-dismissible': showClose,
          'bs-message-with-icon': showIcon
        }
      ]"
      :data-id="id"
      :style="customStyle"
      role="alert message"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <span class="bs-message-icon" v-show="showIcon" v-if="typeof iconName === 'string'">
        <bs-icon :name="iconName"></bs-icon>
      </span>
      <span class="bs-message-icon" v-show="showIcon" v-else>
        <component :is="iconName"></component>
      </span>
      <div class="bs-message-content">
        <slot>
          <div v-if="!dangerouslyUseHTMLString">{{ message }}</div>
          <div v-else v-html="message"></div>
        </slot>
      </div>
      <button
        type="button"
        class="close"
        data-dismiss="alert message"
        aria-label="Close"
        @click.stop="close">
        <span aria-hidden="true">&times;</span>
      </button>
      <bs-badge
        v-if="grouping"
        v-show="repeatNum > 1"
        :type="type"
        class="grouping-badge"
        pill>{{ repeatNum }}</bs-badge>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  computed,
  onMounted,
  watch
} from 'vue';
import { messageProps } from './messageProps';
import { MessageType } from '@/ts-tokens/bootstrap/message';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import BsBadge from '@/components/bootstrap/bs-badge/BsBadge.vue';
const defaultIconMap: Record<MessageType, string> = {
  info: 'info-circle-fill',
  success: 'check-circle-fill',
  warning: 'exclamation-circle-fill',
  danger: 'x-circle-fill'
};
export default defineComponent({
  name: 'BsMessage',
  props: messageProps,
  components: {
    BsIcon,
    BsBadge
  },
  setup (props: any, ctx) {
    let visible = ref(false);
    let timer: number;
    // 图标名称
    let iconName = computed(function () {
      let propsIcon = props.icon;
      if (typeof propsIcon === 'string') {
        if (propsIcon.length > 0) {
          return propsIcon;
        } else {
          return defaultIconMap[(props.type as MessageType)];
        }
      }
      return propsIcon;
    });

    let customStyle = computed(function () {
      return {
        top: props.offsetTop + 'px',
        zIndex: props.zIndex
      };
    });

    let clearTimer = function () {
      clearTimeout(timer);
    };

    let startTimer = function () {
      clearTimer();
      if (props.duration > 0) {
        timer = setTimeout(close, props.duration);
      }
    };

    let close = function () {
      visible.value = false;
      clearTimer();
      if (typeof props.onClose === 'function') {
        props.onClose();
      }
    };

    // message 一显示出来则立即开启倒计时
    watch(visible, function (newVal: boolean) {
      if (newVal) {
        startTimer();
      }
    });
    watch(() => props.repeatNum, function () {
      startTimer();
    });

    onMounted(function () {
      visible.value = true;
    });
    return {
      visible,
      iconName,
      customStyle,

      close,
      clearTimer,
      startTimer
    };
  }
});
</script>

<style lang="scss">
@import "bs-message";
</style>
