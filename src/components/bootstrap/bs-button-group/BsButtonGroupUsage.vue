<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <bs-button-group title="按钮组">
        <bs-button type="secondary">Left</bs-button>
        <bs-button type="secondary">Middle</bs-button>
        <bs-button type="secondary">Right</bs-button>
      </bs-button-group>
      <hr>
      <bs-button-group>
        <bs-button type="success">success</bs-button>
        <bs-button type="info">info</bs-button>
        <bs-button type="warning">warning</bs-button>
        <bs-dropdown>
          <bs-button type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item>Html</bs-dropdown-item>
            <bs-dropdown-item>Css</bs-dropdown-item>
            <bs-dropdown-item>Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </bs-button-group>
    </div>

    <div>
      <hr>
      <h3>垂直的</h3>
      <bs-button-group title="按钮组" vertical>
        <bs-button type="secondary">Left</bs-button>
        <bs-button type="secondary">Middle</bs-button>
        <bs-button type="secondary">Right</bs-button>
      </bs-button-group>
    </div>

    <div>
      <hr>
      <h3>不同大小</h3>
      <div>
        <bs-button-group title="按钮组" size="sm">
          <bs-button type="secondary">Left</bs-button>
          <bs-button type="secondary">Middle</bs-button>
          <bs-button type="secondary">Right</bs-button>
        </bs-button-group>
      </div>
      <div style="margin-top: 1rem;">
        <bs-button-group title="按钮组">
          <bs-button type="secondary">Left</bs-button>
          <bs-button type="secondary">Middle</bs-button>
          <bs-button type="secondary">Right</bs-button>
        </bs-button-group>
      </div>
      <div style="margin-top: 1rem;">
        <bs-button-group title="按钮组" size="lg">
          <bs-button type="secondary">Left</bs-button>
          <bs-button type="secondary">Middle</bs-button>
          <bs-button type="secondary">Right</bs-button>
        </bs-button-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import { BsButtonGroup } from './BsButtonGroup';
import BsButton from '../bs-button/BsButton.vue';

export default defineComponent({
  name: 'BsButtonGroupUsage',
  components: {
    BsButton,
    BsButtonGroup
  }
});
</script>

<style lang="scss" scoped>

</style>
