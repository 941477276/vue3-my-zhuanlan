<template>
<div class="demo-box">
  <div class="demo-box-header">
    <h6 class="demo-title">按钮类型</h6>
    <div class="demo-operate-area">
      <bs-button size="sm">
        <BsiPlayFill></BsiPlayFill>
      </bs-button>
      <bs-button size="sm">
        <BsiFiles></BsiFiles>
      </bs-button>
      <bs-button size="sm">
        <BsiCode></BsiCode>
        <!--<BsiCodeSlash></BsiCodeSlash>-->
      </bs-button>
    </div>
  </div>
  <div class="demo-description">
    理发师的法律解释道 点击索科洛夫家时离开
  </div>
  <div class="demo-example">
    <bs-button>default</bs-button>
    <bs-button type="primary">primary</bs-button>
    <bs-button type="secondary">secondary</bs-button>
    <bs-button type="success">success</bs-button>
    <bs-button type="warning">warning</bs-button>
    <bs-button type="danger">danger</bs-button>
    <bs-button type="info">info</bs-button>
    <bs-button type="light">light</bs-button>
    <bs-button type="danger">danger</bs-button>
  </div>
  <div class="demo-example-code">
    <pre>这是一段代码</pre>
  </div>
</div>
</template>

<script>
import {
  defineComponent
} from 'vue';
import { BsiPlayFill } from 'vue3-bootstrap-icon/es/icons/BsiPlayFill';
import { BsiCode } from 'vue3-bootstrap-icon/es/icons/BsiCode';
// import { BsiCodeSlash } from 'vue3-bootstrap-icon/es/icons/BsiCodeSlash';
import { BsiFiles } from 'vue3-bootstrap-icon/es/icons/BsiFiles';

export default defineComponent({
  name: 'DemoBox',
  components: {
    BsiPlayFill,
    BsiCode,
    // BsiCodeSlash,
    BsiFiles
  }
});
</script>

<style lang="scss">
@import "demo-box";
</style>
