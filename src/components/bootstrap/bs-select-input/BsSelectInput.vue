<template>
  <div
    class="bs-select-input"
    :class="[
      size ? `bs-select-input-${size}` : '',
      {
        'is-focus': isFocus,
        'is-disabled': disabled,
        'is-loading': loading
      }
    ]"
    @click="onRootClick">
    <bs-input
      ref="bsInputRef"
      :disabled="disabled"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="bsSelectInputId"
      v-model="bsInputModelValue"
      :size="size"
      :name="name"
      :delive-context-to-form-item="false"
      :placeholder="bsInputPlaceholder"
      :ariaLabel="ariaLabel"
      :input-style="inputTagsHeight == 0 ? {} : {
        height: inputTagsHeight + 'px'
      }"
      @focus="onBsInputFocus"
      @blur="onBsInputBlur">
      <template #suffix>
        <bs-spinner v-if="loading" :color-type="loadingColorType" :text="loadingText"></bs-spinner>
        <bs-icon v-else name="chevron-down"></bs-icon>
      </template>
    </bs-input>
    <div
      v-if="multiple"
      class="bs-select-input-tags"
      ref="inputTagsRef">
      <bs-tag
        v-for="tag in viewTagList"
        :key="tag.value"
        :type="tag.tagType || tagType"
        :class="tag.tagClass"
        :size="tagSize"
        :closeable="!tag.disabled"
        @close="onTagClose(tag)">
        <slot name="tag" v-bind="tag">{{ tag.label }}</slot>
      </bs-tag>
      <bs-tag
        v-if="maxTagCount > 0 && (values.length - viewTagList.length > 0)"
        class="tag-ommitted"
        key="ommitted_tag"
        :type="tagType"
        :size="tagSize">
        <slot name="maxTagPlaceholder" v-bind="{ omittedCount: values.length - viewTagList.length }">+ {{ values.length - viewTagList.length }}...</slot>
      </bs-tag>
      <input
        ref="searchInputRef"
        v-model="searchText"
        type="search"
        class="bs-select-input-search"
        autocomplete="off"
        :style="{
          width: searchInputWidth > 0 ? (searchInputWidth + 'px') : ''
        }"
        @blur="onSearchInputBlur">
      <span
        ref="auxiliaryCalcTextWidthBoxRef"
        class="bs-select-input-search auxiliary-calc-text-width-box">{{ searchText }}</span>
    </div>
    <div v-if="loading" class="bs-select-input-loading-shadow"></div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  watch,
  defineComponent,
  onUpdated,
  onMounted,
  nextTick
} from 'vue';
import BsInput from '../bs-input/BsInput.vue';
import BsTag from '../bs-tag/BsTag.vue';
import BsSpinner from '@/components/bootstrap/bs-spinner/BsSpinner.vue';
import { bsSelectInputProps, ValueItem } from './bs-select-input-props';
import { useInput } from './useInput';

let bsSelectInputCount = 0;
export default defineComponent({
  name: 'BsSelectInput',
  components: {
    BsInput,
    BsTag,
    BsSpinner
  },
  props: {
    ...bsSelectInputProps
  },
  emits: ['click', 'tag-close', 'filter-text-change'],
  setup (props: any, ctx: any) {
    let bsSelectInputId = ref(props.id || `bs_select_input-${++bsSelectInputCount}`);
    let inputTagsRef = ref<HTMLElement|null>(null);

    let {
      bsInputReadonly,
      bsInputModelValue,
      bsInputValue,
      bsInputFocus,
      bsInputPlaceholder,

      onBsInputFocus,
      onBsInputBlur
    } = useInput(props, ctx);
    let isFocus = ref(false);

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
      nextTick(function () {
        inputTagsHeight.value = inputTagsEl.offsetHeight;
      });
    };
    watch(() => [...props.values], function () {
      if (props.multiple) {
        console.log('do calcInputTagsHeight');
        // 这里使用 nextTick 无效，会导致高度计算不准确
        setTimeout(function () {
          calcInputTagsHeight();
        }, 0);
      }
    }, { immediate: true });

    // 用于显示的标签
    let viewTagList = computed(function () {
      let maxTagCount = props.maxTagCount;
      let values = props.values;
      if (!maxTagCount || maxTagCount < 0) {
        return values;
      }
      maxTagCount = Math.ceil(maxTagCount);
      return values?.slice(0, maxTagCount);
    });
    // tag 关闭事件
    let onTagClose = function (tag: ValueItem) {
      // console.log('tag关闭了：', tag);
      ctx.emit('tag-close', tag);
    };

    // 搜索文本
    let searchText = ref('');
    let searchInputWidth = ref(0);
    let auxiliaryCalcTextWidthBoxRef = ref<HTMLElement|null>(null);
    let searchInputRef = ref<HTMLElement|null>(null);

    let searchInputFocus = function () {
      searchInputRef.value?.focus();
    };
    let searchInputBlur = function () {
      searchInputRef.value?.blur();
    };
    // 搜索框失去焦点事件
    let onSearchInputBlur = function () {
      searchText.value = '';
    };

    watch(searchText, function (newSearchText) {
      setTimeout(function () {
        searchInputWidth.value = auxiliaryCalcTextWidthBoxRef.value?.offsetWidth || 0;
        calcInputTagsHeight();
      }, 0);
      ctx.emit('filter-text-change', newSearchText);
    });

    let tagSize = computed(function () {
      let size = props.size;
      if (!size) {
        return 'md';
      }
      if (size == 'lg') {
        return '';
      }
      return size;
    });

    let onRootClick = function (evt: MouseEvent) {
      console.log(1111);
      if (props.disabled || props.loading) {
        return;
      }
      /* isFocus.value = true;
      if (props.multiple) {
        searchInputRef.value?.focus();
      } */
      ctx.emit('click', evt);
    };

    return {
      bsSelectInputId,
      inputTagsRef,

      bsInputReadonly,
      bsInputModelValue,
      bsInputValue,
      bsInputFocus,
      bsInputPlaceholder,
      isFocus,

      inputTagsHeight,
      viewTagList,
      tagSize,

      searchText,
      searchInputWidth,
      searchInputRef,
      auxiliaryCalcTextWidthBoxRef,

      searchInputFocus,
      searchInputBlur,

      onBsInputFocus,
      onBsInputBlur,
      onTagClose,
      onRootClick,
      onSearchInputBlur
    };
  }
});
</script>

<style lang="scss">
@import "bs-select-input";
</style>
