<template>
<div class="component-usage">
  <h3>UI样式</h3>
  <bs-message-box
    title="温馨提示"
    message="一个消息盒子！"></bs-message-box>

  <hr>
  <h3>弹窗样式</h3>
  <bs-message-box
    title="弹窗样式的温馨提示"
    :dialog-theme="true"
    :show-close="true">
    一个弹窗样式消息盒子！
  </bs-message-box>

  <hr>
  <h3>没有图标</h3>
  <bs-message-box
    title="没有图标的消息盒子"
    :dialog-theme="true"
    :show-close="true"
    :show-icon="false">
    一个弹窗样式消息盒子！
  </bs-message-box>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';

export default defineComponent({
  name: 'BsMessageBoxUsage',
  components: {},

  setup () {
    return {};
  }
});
</script>

<style lang="scss" scoped>

</style>
