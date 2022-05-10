<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsTooltip>
        <bs-button type="primary" style="margin-left: 120px;">触发按钮</bs-button>
        <template #content>
          我是一个 <strong>Popper</strong>内容 !
          <p>我是一个popper!我是一个popper!我是一个popper!</p>
        </template>
      </BsTooltip>

      <!--<BsTooltip>
        一段文本
      </BsTooltip>-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsTooltipUsage',
  components: {}

});
</script>

<style lang="scss" scoped>
.component-usage{
  min-height: 1500px;
  padding-top: 10%;
}
</style>
