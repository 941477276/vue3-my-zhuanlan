<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsCascader></BsCascader>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsCascader from './BsCascader.vue';

export default defineComponent({
  name: 'BsCascaderUsage',
  components: {
    BsCascader
  }
});
</script>

<style lang="scss" scoped>
.bs-cascader{
  max-width: 360px;
}
</style>
