<template>
  <div
    class="bs-select-input"
    :class="[
      size ? `bs-select-input-${size}` : ''
    ]">
    <bs-input
      ref="bsInputRef"
      :disabled="disabled || loading"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="bsSelectInputId"
      value=""
      :size="size"
      :name="name"
      :delive-context-to-form-item="false"
      :placeholder="loading ? loadingText : placeholder"
      :ariaLabel="ariaLabel"
      data-clear="onInputClear">
      <template #suffix>
        <bs-icon name="chevron-down"></bs-icon>
      </template>
    </bs-input>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsInput from '../bs-input/BsInput.vue';
import { bsSelectInputProps } from './bs-select-input-props';

let bsSelectInputCount = 0;
export default defineComponent({
  name: 'BsSelectInput',
  components: {
    BsInput
  },
  props: {
    ...bsSelectInputProps
  },
  emits: [],
  setup (props: any, ctx: any) {
    let bsSelectInputId = ref(props.id || `bs_select_input-${++bsSelectInputCount}`);
    let bsInputReadonly = ref(true);
    return {
      bsSelectInputId,
      bsInputReadonly
    };
  }
});
</script>

<style lang="scss">
@import "bs-select-input";
</style>
