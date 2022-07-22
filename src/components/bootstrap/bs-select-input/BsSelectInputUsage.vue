<template>
  <div class="component-usage">
    <div>
      <BsSelectInput
        :values="values1"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"></BsSelectInput>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent
} from 'vue';
import BsSelectInput from './BsSelectInput.vue';

export default defineComponent({
  name: 'BsSelectInputUsage',
  components: {
    BsSelectInput
  },
  setup () {
    let values1 = ref([{ label: 'Vue.js', value: 'vue' }]);
    return {
      values1
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-select-input{
  max-width: 260px;
}
</style>
