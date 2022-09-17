<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsCascader
        v-model="cascader1"
        :options="dataOptions1"
        :check-strictly="true"></BsCascader>
      <div>{{ cascader1 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsCascader from './BsCascader.vue';
import BsIcon from '@/components/bootstrap/bs-icon/BsIcon.vue';
import { options1 } from './test-options';

export default defineComponent({
  name: 'BsCascaderUsage',
  components: {
    BsCascader
  },
  setup () {
    let dataOptions1 = ref(options1);

    let cascader1 = ref([]);
    return {
      dataOptions1,
      cascader1
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-cascader{
  max-width: 360px;
}
</style>
