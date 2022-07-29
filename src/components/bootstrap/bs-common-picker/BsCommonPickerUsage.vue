<template>
  <div class="component-usage">
    <a-date-picker v-model:value="value1" />
    <a-date-picker v-model:value="value2" picker="week" />
    <a-date-picker v-model:value="value3" picker="month" />
    <a-date-picker v-model:value="value4" picker="quarter" />
    <a-date-picker v-model:value="value5" picker="year" />
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsCommonPickerUsage',
  setup () {
    return {
      value1: ref(''),
      value2: ref(''),
      value3: ref(''),
      value4: ref(''),
      value5: ref('')
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
