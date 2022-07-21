<template>
  <div class="component-usage">
    <div>
      <BsSelectInput></BsSelectInput>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsSelectInput from './BsSelectInput.vue';

export default defineComponent({
  name: 'BsSelectInputUsage',
  components: {
    BsSelectInput
  }
});
</script>

<style lang="scss" scoped>
.bs-select-input{
  max-width: 260px;
}
</style>
