<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsCascader
        :options="dataOptions1"></BsCascader>
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
    return {
      dataOptions1
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-cascader{
  max-width: 360px;
}
</style>
