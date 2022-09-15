<template>
  <div class="bs-cascader" ref="bsCascaderRef">
    <BsSelectInput
      ref="bsCascaderInputRef"
      :disabled="disabled"
      :loading="loading"
      :loading-text="loadingText"
      :loading-color-type="loadingColorType"
      :clearable="clearable"
      :id="cascaderId"
      :values="viewText"
      :size="size"
      :multiple="multiple"
      :filterable="filterable"
      :placeholder="placeholder"
      :max-tag-count="maxTagCount"
      :tag-type="tagType"
      :tag-effect="tagEffect"
      :tag-closeable="tagCloseable"
      @click="onCascaderInputClick"
      @tag-close="onTagClose"
      @filter-text-change="onFilterTextChange"
      @clear="onCascaderInputClear"></BsSelectInput>
    <div class="bs-cascader-menus">
      <BsCascaderMenu></BsCascaderMenu>
      <BsCascaderMenu></BsCascaderMenu>
      <BsCascaderMenu></BsCascaderMenu>
    </div>
    <teleport :disabled="!teleported" :to="appendTo">
      <BsDropdownTransition
        ref="dropdownTransitionRef"
        placement="bottom"
        :reference-ref="bsCascaderRef"
        :try-all-placement="false"
        :set-width="true">
        <div
          v-show="dropdownVisible"
          ref="bsSelectDropdownRef"
          class="bs-cascader-dropdown"
          :class="{
            'is-multiple': multiple
          }"
          :data-for-select="cascaderId">
          <h1>下拉菜单</h1>
        </div>
      </BsDropdownTransition>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  watch
} from 'vue';
import {
  NOOP
} from '@vue/shared';
import BsSelectInput from '../bs-select-input/BsSelectInput.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsCascaderMenu from './widgets/bs-cascader-menu.vue';
import { bsCascaderProps } from './props';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDeliverContextToFormItem } from '@/hooks/useDeliverContextToFormItem';
import { ValidateStatus } from '@/ts-tokens/bootstrap';
import { CascaderOptionItem } from '@/ts-tokens/bootstrap/cascader';
import { SelectContext, selectContextKey } from '@/ts-tokens/bootstrap/select';

let cascaderCount = 0;
export default defineComponent({
  name: 'BsCascader',
  props: bsCascaderProps,
  components: {
    BsSelectInput,
    BsDropdownTransition,
    BsCascaderMenu
  },
  emits: ['update:modelValue', 'change', 'selectLimit'],
  setup (props: any, ctx: any) {
    let bsCascaderRef = ref<HTMLElement|null>(null);
    let bsCascaderInputRef = ref<ComponentInternalInstance|null>(null);
    let bsCascaderDropdownRef = ref<HTMLElement|null>(null);
    let dropdownTransitionRef = ref(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let cascaderId = ref(props.id || `bs-cascader_${++cascaderCount}`);
    let dropdownDisplayed = ref(false); // 下拉菜单是否已经渲染
    let dropdownVisible = ref(false); // 下拉菜单是否显示
    let optionItems = ref<CascaderOptionItem[]>([]); // 存储option的label及value

    let nativeCascaderModel = computed({
      get () {
        if (Array.isArray(props.modelValue)) {
          return [...props.modelValue];
        } else {
          return props.modelValue;
        }
      },
      set (newVal: any) {
        console.log('原生select修改值：', newVal);
      }
    });
    /**
     * 显示下拉菜单
     */
    let dropdownShow = function () {
      if (props.disabled) {
        return;
      }
      dropdownVisible.value = true;
      if (!props.loading) {
        isFocus.value = true;
        (bsCascaderInputRef.value as any)?.focus();
      }
    };
    /**
     * 隐藏下拉菜单
     */
    let dropdownHide = function () {
      // 延迟一会隐藏下拉菜单是因为为了等待背景色改变后再隐藏
      let timer = setTimeout(function () {
        clearTimeout(timer);
        dropdownVisible.value = false;
        isFocus.value = false;
        (bsCascaderInputRef.value as any)?.blur();
      }, 120);
    };

    /**
     * 修改值
     * @param val 值
     * @param isDelete 是否移除
     */
    let changeVal = function (val: any, isDelete?: boolean) {
      if (props.multiple) {
        let selectModelValue: unknown[] = (props.modelValue || []).slice();
        if (isDelete === true) {
          let index = selectModelValue.indexOf(val);
          if (index > -1) {
            // console.log('changeVal 2, isDelete=true', props.modelValue, val, index);
            selectModelValue.splice(index, 1);
            ctx.emit('update:modelValue', selectModelValue);
            ctx.emit('change', selectModelValue);
            callFormItem('validate', 'change');
          }
        } else {
          let multipleLimit = props.multipleLimit;
          if (typeof multipleLimit === 'number' && multipleLimit > 0 && selectModelValue.length >= multipleLimit) {
            ctx.emit('selectLimit', multipleLimit);
            return;
          }
          selectModelValue.push(val);
          ctx.emit('update:modelValue', selectModelValue);
          ctx.emit('change', selectModelValue);
          callFormItem('validate', 'change');
        }
        // 多选时值改变后需要刷新下拉内容
        let timer = setTimeout(function () {
          clearTimeout(timer);
          (dropdownTransitionRef.value as any)?.refresh();
        }, 60);
      } else {
        if (isDelete === true) {
          if (props.modelValue === val) {
            // console.log('changeVal 2, isDelete=true', props.modelValue, val);
            ctx.emit('update:modelValue', '');
            ctx.emit('change', '');
            dropdownHide();
            callFormItem('validate', 'change');
            return;
          }
          return;
        }
        ctx.emit('update:modelValue', val);
        ctx.emit('change', val);
        dropdownHide();
        callFormItem('validate', 'change');
      }
    };

    /**
     * 添加option
     * @param option
     */
    let addOption = function (option: CascaderOptionItem) {
      let optionExists = optionItems.value.some((optionItem: CascaderOptionItem) => optionItem.id === option.id);
      // console.log('optionExists', optionExists);
      if (!optionExists) {
        optionItems.value.push(option);
      }
    };
    /**
     * 移除option
     * @param option
     */
    let removeOption = function (optionId: string, optionValue: any) {
      let index = optionItems.value.findIndex((optionItem: CascaderOptionItem) => optionItem.id === optionId);
      if (index > -1) {
        optionItems.value.splice(index, 1);
        // console.log('removeOption changeVal', optionValue);
        changeVal(optionValue, true);
      }
    };

    let viewText = computed(function () {
      let modelValue = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
      let selectedOptionLabels = optionItems.value.filter(function (option: CascaderOptionItem) {
        // console.log('option.value', option.value);
        return modelValue.includes(option.value);
      }).map(function (option: CascaderOptionItem) {
        let newOption = {
          ...option,
          label: option.label || option.labelSlot
        };
        return newOption;
      });
      // console.log('selectedOptionLabels', selectedOptionLabels);
      return selectedOptionLabels;
    });

    let isClickOutside = useClickOutside([bsCascaderRef, bsCascaderDropdownRef]);
    watch(isClickOutside, (newVal: boolean) => {
      // console.log('isClickOutside', isClickOutside.value);
      if (newVal) {
        dropdownHide();
      }
    });

    // 输入框点击事件
    let onCascaderInputClick = function () {
      if (props.disabled) {
        return;
      }
      if (dropdownVisible.value) {
        if (!props.multiple) {
          dropdownHide();
        } else {
          (bsCascaderInputRef.value as any)?.focus();
        }
      } else {
        dropdownShow();
      }
    };

    // 标签关闭事件
    let onTagClose = function (option: CascaderOptionItem) {
      changeVal(option.value, true);
    };

    let filterText = ref('');
    // 搜索文本change事件
    let onFilterTextChange = function (searchText: string) {
      console.log('搜索文本：', searchText);
      filterText.value = searchText;
    };
    // 默认的搜索函数
    let filterMethodInner = function (option: CascaderOptionItem) {
      let text = filterText.value;
      if (!text) {
        return true;
      }
      let label = option.label;
      if (label == null || typeof label === 'undefined') {
        return false;
      }
      return (label + '').toLowerCase().includes(text.toLowerCase());
    };

    // 清空内容
    let onCascaderInputClear = function () {
      let val = props.multiple ? [] : '';
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
      callFormItem('validate', 'change');
    };

    let { callFormItem } = useDeliverContextToFormItem(props, {
      id: cascaderId.value,
      setValidateStatus: (status: ValidateStatus) => {
        // console.log('调select组件的setValidateStatus方法l');
        (bsCascaderInputRef.value as any)?.setValidateStatus(status);
      }
    });

    provide<SelectContext>(selectContextKey, reactive({
      props,
      ctx,
      filterText,
      // 给 option 子组件调用
      filterMethod: filterMethodInner,
      changeVal: NOOP,
      addOption: NOOP,
      removeOption: NOOP
    }));
    return {
      bsCascaderRef,
      bsCascaderInputRef,
      bsCascaderDropdownRef,
      dropdownTransitionRef,
      bsInputReadonly,
      isFocus,
      cascaderId,
      dropdownDisplayed,
      dropdownVisible,
      optionItems,
      nativeCascaderModel,
      viewText,

      // onCascaderRootClick,
      onCascaderInputClear,
      dropdownShow,
      dropdownHide,

      onCascaderInputClick,
      onTagClose,
      onFilterTextChange
    };
  }
});
</script>

<style lang="scss">
@import "bs-cascader";
</style>
