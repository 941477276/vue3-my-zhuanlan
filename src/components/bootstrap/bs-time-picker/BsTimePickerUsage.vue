<template>
  <div class="component-usage">
    <div>
      <h3>AntDesign Time Picker</h3>
      <a-time-picker v-model:value="strValue" value-format="HH:mm:ss" />
    </div>
    <div style="margin-top: 1rem;">
      <hr>
      <h3>基本使用</h3>
      <BsTimePicker></BsTimePicker>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import BsTimePicker from './BsTimePicker.vue';

export default defineComponent({
  name: 'BsTimePickerUsage',
  components: {
    BsTimePicker
  },
  setup () {
    const strValue = ref<string>('09:00:00');
    return {
      strValue
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-date-editor{
  max-width: 200px;
}
</style>
