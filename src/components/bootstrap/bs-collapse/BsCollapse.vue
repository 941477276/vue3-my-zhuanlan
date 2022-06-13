<template>
  <div class="bs-collapse">
    <BsCollapseItem></BsCollapseItem>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsCollapseItem from './widgets/BsCollapseItem.vue';

export default defineComponent({
  name: 'BsCollapse',
  components: {
    BsCollapseItem
  }
});
</script>

<style lang="scss">

</style>
