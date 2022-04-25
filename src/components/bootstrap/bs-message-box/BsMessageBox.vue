<template>
<div class="bs-message-box-wrapper" role="dialog" aria-modal="true">
  <div class="bs-message-box">
    <!--<div class="bs-message-box-header has-close">
      <div class="bs-message-box-title">温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示</div>
      <bs-button class="bs-message-box-close" type="link" aria-label="close">
        <span>×</span>
      </bs-button>
    </div>-->
    <div class="bs-message-box-body">
      <span class="bs-message-box-icon">
         <BsIcon name="check-circle-fill"></BsIcon>
      </span>
      <div class="bs-message-box-content-wrap">
        <div class="bs-message-box-title">温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示温馨提示</div>
        <div class="bs-message-box-content">message box内容区域！message box内容区域！message box内容区域！message box内容区域！message box内容区域！</div>
      </div>
    </div>
    <div class="bs-message-box-btns">
      <bs-button type="primary" plain>取消</bs-button>
      <bs-button type="primary">确定</bs-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import BsButton from '../bs-button/BsButton.vue';
import BsIcon from '../bs-icon/BsIcon.vue';
import { MessageType } from '@/ts-tokens/bootstrap/message';

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
  }
});
</script>

<style lang="scss">
@import "bs-message-box";
</style>
