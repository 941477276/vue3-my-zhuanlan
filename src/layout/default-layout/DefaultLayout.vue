<template>
<div class="default-layout">
  <GlobalHeader></GlobalHeader>
  <div class="layout-container">
    <router-view></router-view>
  </div>
  <GlobalFooter></GlobalFooter>
</div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import GlobalHeader from '@/layout/global-header/GlobalHeader.vue';
import GlobalFooter from '@/layout/global-footer/GlobalFooter.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    GlobalHeader,
    GlobalFooter
  }
});
</script>

<style lang="scss">
.default-layout{
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .layout-container{
    flex: 1;
  }
}
</style>
