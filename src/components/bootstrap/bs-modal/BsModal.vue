<template>
  <div class="bs-modal modal" tabindex="-1" role="dialog" aria-hidden="false" aria-modal="true">
    <div
      class="modal-dialog"
      :class="[
        {
          'modal-dialog-scrollable': scrollable,
          'modal-dialog-centered': centered
        },
        size ? `modal-${size}` : ''
      ]">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div
          v-if="showFooter"
          class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import { bsModalProps } from './props';

export default defineComponent({
  name: 'BsModal',
  props: bsModalProps
});
</script>

<style lang="scss">

</style>
