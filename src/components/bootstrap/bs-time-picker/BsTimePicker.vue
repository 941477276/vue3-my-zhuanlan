<template>
  <div class="bs-date-editor">
    <BsInput
      suffix-icon="clock"
      clearable></BsInput>
    <div class="bs-picker-dropdown">
      <div class="bs-picker-panel-container">
        <div class="bs-picker-panel">
          <BsPickerTimePanel></BsPickerTimePanel>
          <div class="bs-picker-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import BsInput from '../bs-input/BsInput.vue';
import BsPickerTimePanel from './widgets/BsPickerTimePanel.vue';

export default defineComponent({
  name: 'BsTimePicker',
  components: {
    BsInput,
    BsPickerTimePanel
  },
  setup (props: any, ctx: any) {
    return {

    };
  }
});
</script>

<style lang="scss">
@import "bs-time-picker";
</style>
