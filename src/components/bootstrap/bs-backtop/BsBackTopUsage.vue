<template>
  <div class="component-usage">
    <BsBackTop></BsBackTop>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsBackTop from './BsBackTop.vue';

export default defineComponent({
  name: 'BsBackTopUsage',
  components: {
    BsBackTop
  }
});
</script>

<style lang="scss" scoped>

</style>
