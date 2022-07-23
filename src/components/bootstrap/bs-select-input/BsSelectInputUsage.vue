<template>
  <div class="component-usage">
    <div>
      <BsSelectInput
        :values="values1"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="false"
        :max-tag-count="3"
        @tag-close="onTagClose"></BsSelectInput>
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
    let values1 = ref([
      { label: 'HTML', value: 'html' },
      { label: 'Css', value: 'css' },
      { label: 'Javascript', value: 'javascript' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'React.js', value: 'react' }
    ]);
    let onTagClose = function (tag: any) {
      console.log('tag标签关闭事件');
      let index = values1.value.findIndex(item => item.value === tag.value);
      if (index > -1) {
        values1.value.splice(index, 1);
      }
    };
    return {
      values1,

      onTagClose
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-select-input{
  max-width: 260px;
}
</style>
