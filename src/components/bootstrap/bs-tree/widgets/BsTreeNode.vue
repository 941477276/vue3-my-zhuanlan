<template>
  <div class="bs-tree-node">
    <div class="bs-tree-node-content" data-class="is-tree-branch is-tree-leaf">
      <span role="button" class="bs-tree-node-switcher">
        <slot name="switcher-icon">
          <!--<i class="bs-tree-node-switcher-arrow"></i>-->
          <i class="bs-tree-node-switcher-arrow" role="img">
            <svg class="switcher-arrow-svg" viewBox="0 0 1024 1024" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>
          </i>
        </slot>
        <BsSpinner v-if="false" class="bs-tree-node-spinner" color-type="primary"></BsSpinner>
      </span>
      <BsCheckbox></BsCheckbox>
      <BsRadio v-if="false"></BsRadio>
      <slot>
        <div class="bs-tree-node-label">
          a tree node
        </div>
      </slot>
    </div>
    <div class="bs-tree-node-children">

    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsCheckbox from '@/components/bootstrap/bs-checkbox/BsCheckbox.vue';
import BsRadio from '@/components/bootstrap/bs-radio/BsRadio.vue';
import BsSpinner from '@/components/bootstrap/bs-spinner/BsSpinner.vue';

export default defineComponent({
  name: 'BsTreeNode',
  components: {
    BsCheckbox,
    BsRadio,
    BsSpinner
  }
});
</script>

<style lang="scss">
@import "bs-tree-node";
</style>
