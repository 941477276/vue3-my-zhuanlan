<template>
<div class="component-usage">
 <h3>基础用法</h3>
  <div>
    <bs-switch></bs-switch>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsSwitchUsage',
  components: {},
  setup (props: any) {
    return {
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-tag{
  margin-right: 10px;
}
</style>
