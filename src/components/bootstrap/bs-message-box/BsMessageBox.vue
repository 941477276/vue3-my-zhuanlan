<template>
<div class="bs-message-box-wrapper" role="dialog" aria-modal="true">
  <div class="bs-message-box theme-dialog">
    <div class="bs-message-box-header">
      <div class="bs-message-box-title">温馨提示</div>
    </div>
    <div class="bs-message-box-body">
      <p>一个消息弹窗！</p>
      <p>一个消息弹窗！</p>
      <p>一个消息弹窗！</p>
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

export default defineComponent({
  name: 'BsMessageBox',
  components: {
    BsButton
  }
});
</script>

<style lang="scss">
@import "bs-message-box";
</style>
