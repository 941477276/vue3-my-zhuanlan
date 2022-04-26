<template>
<div
  class="bs-message-box-wrapper"
  role="dialog"
  aria-modal="true"
  :aria-label="typeof title === 'function' ? title() : title"
  :data-id="id">
  <div
    class="bs-message-box"
    :class="[
      {
        'theme-dialog': dialogTheme
      },
      `bs-message-box-${type}`
    ]"
    :style="{
      maxWidth: maxWidth
    }">
    <div
      v-if="dialogTheme"
      class="bs-message-box-header"
      :class="{
        'has-close': showClose
      }">
      <div class="bs-message-box-title">
        {{ typeof title === 'function' ? title() : title }}
      </div>

      <bs-button class="bs-message-box-close" type="link" aria-label="close">
        <span>×</span>
      </bs-button>
    </div>
    <div class="bs-message-box-body">
      <span
        v-if="showIcon"
        class="bs-message-box-icon">
        <slot name="icon">
          <BsIcon :name="iconName"></BsIcon>
        </slot>
      </span>
      <div class="bs-message-box-content-wrap">
        <div class="bs-message-box-title" v-if="!dialogTheme">
          <slot name="title">{{ typeof title === 'function' ? title() : title }}</slot>
        </div>
        <div class="bs-message-box-content">
          <slot>
            <div v-if="dangerouslyUseHTMLString" v-html="message"></div>
            <template v-else>{{ message }}</template>
          </slot>
        </div>
      </div>
    </div>
    <div class="bs-message-box-btns">
      <bs-button v-if="showCancelButton" type="primary" plain>取消</bs-button>
      <bs-button
        v-if="showOnButton"
        :type="okType"
        :loading="okLoading"
        :disabled="okLoading || okDisabled">{{ okText }}</bs-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed
} from 'vue';
import BsButton from '../bs-button/BsButton.vue';
import BsIcon from '../bs-icon/BsIcon.vue';
import { bsMessageBoxProps } from './bs-message-box-props';
import { MessageType, supportMessageTypes } from '@/ts-tokens/bootstrap/message';

const defaultIconMap: Record<MessageType, string> = {
  info: 'info-circle-fill',
  success: 'check-circle-fill',
  warning: 'exclamation-circle-fill',
  danger: 'x-circle-fill'
};
let messageBoxCount = 0;
export default defineComponent({
  name: 'BsMessageBox',
  components: {
    BsButton,
    BsIcon
  },
  props: bsMessageBoxProps,
  setup (props: any) {
    let id = props.id || `bs_message_box-${++messageBoxCount}`;
    let iconName = computed(function () {
      return defaultIconMap[props.icon as MessageType] || defaultIconMap.info;
    });

    let visible = ref(false);

    return {
      iconName,
      id
    };
  }
});
</script>

<style lang="scss">
@import "bs-message-box";
</style>
