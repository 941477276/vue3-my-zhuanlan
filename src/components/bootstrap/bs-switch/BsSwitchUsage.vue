<template>
<div class="component-usage">
 <h3>基础用法</h3>
  <div>
    <bs-switch v-model="switch1"></bs-switch>
  </div>

  <hr>
  <h3>禁用和loading</h3>
  <div>
    <div style="margin-bottom: 10px;">
      禁用的：<bs-switch v-model="switch2" disabled></bs-switch>
      <bs-switch style="margin-left: 10px;" :model-value="true" disabled></bs-switch>
    </div>

    <div>
      加载中：<bs-switch v-model="switch2" loading></bs-switch>
      <bs-switch style="margin-left: 10px;" :model-value="true" loading></bs-switch>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsSwitchUsage',
  components: {},
  setup (props: any) {
    let switch1 = ref(false);
    let switch2 = ref(false);
    return {
      switch1,
      switch2
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-tag{
  margin-right: 10px;
}
</style>
