<template>
  <div class="bs-picker-date-panel">
    <PanelHeader></PanelHeader>
    <PanelBody></PanelBody>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import PanelHeader from '../panel-header/PanelHeader.vue';
import PanelBody from '../panel-body/PanelBody.vue';

export default defineComponent({
  name: 'BsDatePanel',
  components: {
    PanelHeader,
    PanelBody
  },
  setup (props: any, ctx: any) {
    return {

    };
  }
});
</script>

<style lang="scss">

</style>
