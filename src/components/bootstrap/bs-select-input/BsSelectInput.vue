<template>
  <div
    class="bs-select-input"
    :class="[
      size ? `bs-select-input-${size}` : '',
      {
        'is-focus': isFocus
      }
    ]"
    @click="$emit('click', $event)">
    <bs-input
      ref="bsInputRef"
      :disabled="disabled || loading"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="bsSelectInputId"
      v-model="bsInputModelValue"
      :size="size"
      :name="name"
      :delive-context-to-form-item="false"
      :placeholder="bsInputFocus ? bsInputValue : placeholder"
      :ariaLabel="ariaLabel"
      :input-style="inputTagsHeight == 0 ? {} : {
        height: inputTagsHeight + 'px'
      }"
      @focus="onBsInputFocus"
      @blur="onBsInputBlur">
      <template #suffix>
        <bs-icon name="chevron-down"></bs-icon>
      </template>
    </bs-input>
    <div
      class="bs-select-input-tags"
      ref="inputTagsRef">
      <bs-tag :type="tagType" size="medium" closeable>Javascript</bs-tag>
      <bs-tag :type="tagType" size="medium" closeable>Html</bs-tag>
      <bs-tag :type="tagType" size="medium" closeable>Css</bs-tag>
      <bs-tag :type="tagType" size="medium" closeable>Vue</bs-tag>
      <bs-tag :type="tagType" size="medium" closeable>Vue</bs-tag>
      <bs-tag :type="tagType" size="medium" closeable>React</bs-tag>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  onUpdated,
  onMounted,
  nextTick
} from 'vue';
import BsInput from '../bs-input/BsInput.vue';
import BsTag from '../bs-tag/BsTag.vue';
import { bsSelectInputProps } from './bs-select-input-props';
import { useInput } from './useInput';

let bsSelectInputCount = 0;
export default defineComponent({
  name: 'BsSelectInput',
  components: {
    BsInput,
    BsTag
  },
  props: {
    ...bsSelectInputProps
  },
  emits: ['click'],
  setup (props: any, ctx: any) {
    let bsSelectInputId = ref(props.id || `bs_select_input-${++bsSelectInputCount}`);
    let inputTagsRef = ref<HTMLElement|null>(null);

    let {
      bsInputReadonly,
      bsInputModelValue,
      bsInputValue,
      bsInputFocus,

      onBsInputFocus,
      onBsInputBlur
    } = useInput(props, ctx);

    // 计算 .bs-select-input-tags 容器高度
    /* let inputTagsHeight = computed(function () {
      let inputTagsEl = inputTagsRef.value as HTMLElement;
      if (!inputTagsEl) {
        return 0;
      }
      return inputTagsEl.offsetHeight;
    }); */
    let inputTagsHeight = ref(0);
    let calcInputTagsHeight = function () {
      let inputTagsEl = inputTagsRef.value as HTMLElement;
      if (!inputTagsEl) {
        inputTagsHeight.value = 0;
      }
      inputTagsHeight.value = inputTagsEl.offsetHeight;
    };
    onUpdated(function () {
      console.log('updated');
      setTimeout(function () {
        calcInputTagsHeight();
      }, 0);
    });
    onMounted(function () {
      console.log('onMounted');
      calcInputTagsHeight();
    });

    return {
      bsSelectInputId,
      inputTagsRef,

      bsInputReadonly,
      bsInputModelValue,
      bsInputValue,
      bsInputFocus,

      inputTagsHeight,

      onBsInputFocus,
      onBsInputBlur
    };
  }
});
</script>

<style lang="scss">
@import "bs-select-input";
</style>
