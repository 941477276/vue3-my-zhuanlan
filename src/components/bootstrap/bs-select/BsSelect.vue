<template>
  <div
    ref="bsSelectRef"
    class="bs-select"
    :class="[
      {
        'is-disabled': disabled,
        'is-focus': isFocus,
        'is-multiple': multiple
      },
      size ? `bs-select-${size}` :''
    ]"
    :data-bs-id="selectId"
    data-click="onSelectRootClick">
    <select
      v-model="nativeSelectModel"
      :name="name"
      :multiple="multiple"
      style="display: none;">
      <option
        v-for="item in optionItems"
        :key="item.id"
        :value="item.value"
        :disabled="item.disabled">{{ item.label || item.labelSlot }}</option>
    </select>
    <BsSelectInput
      ref="bsSelectInputRef"
      :disabled="disabled"
      :loading="loading"
      :loading-text="loadingText"
      :loading-color-type="loadingColorType"
      :clearable="clearable"
      :id="selectId"
      :values="viewText"
      :size="size"
      :multiple="multiple"
      :filterable="filterable"
      :placeholder="placeholder"
      :max-tag-count="maxTagCount"
      :tag-type="tagType"
      @click="onSelectInputClick"
      @tag-close="onTagClose"
      @filter-text-change="onFilterTextChange"
      @clear="onSelectInputClear"></BsSelectInput>
    <!-- 这里不能使用延迟渲染的方案，因为这会导致子组件也延迟渲染，从而导致上面的<select>标签不能在组件渲染时就生成
      <teleport to="body" v-if="dropdownDisplayed">-->
    <teleport :disabled="!teleported" :to="appendTo">
      <BsDropdownTransition
        ref="dropdownTransitionRef"
        placement="bottom"
        :reference-ref="bsSelectRef"
        :try-all-placement="false"
        :set-width="true">
        <div
          v-show="dropdownVisible"
          ref="bsSelectDropdownRef"
          class="bs-select-dropdown"
          :class="{
            'is-multiple': multiple
          }"
          :data-for-select="selectId">
          <ul class="bs-select-option-list">
            <template v-if="options">
              <template
                v-for="(option, index) in options">
                <BsOptionGroup
                  v-if="option.options"
                  :key="`option_group-${index}`"
                  :disabled="option.disabled"
                  :label="option.label">
                  <BsOption
                    v-for="(groupOption, index2) in option.options"
                    :key="groupOption.value"
                    :value="groupOption.value"
                    :disabled="groupOption.disabled"
                    :tag-type="groupOption.tagType"
                    :tag-class="groupOption.tagClass">
                    <slot name="option" v-bind="{ option: groupOption, index2 }">{{ groupOption.label }}</slot>
                  </BsOption>
                </BsOptionGroup>
                <BsOption
                  v-else
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                  :tag-type="option.tagType"
                  :tag-class="option.tagClass">
                  <slot name="option" v-bind="{ option, index }">{{ option.label }}</slot>
                </BsOption>
              </template>

            </template>
            <slot></slot>
            <li
              v-if="!loading && optionItems.length == 0"
              class="bs-select-empty">
              <slot name="empty">{{ noDataText }}</slot>
            </li>
            <li class="bs-select-loading" v-if="loading">
              <slot name="loading">
                <BsSpinner></BsSpinner>
                <span class="bs-select-loading-text">{{loadingText}}</span>
              </slot>
            </li>
          </ul>
          <!--扩展内容-->
          <slot name="extra"></slot>
        </div>
      </BsDropdownTransition>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  PropType,
  ref,
  reactive,
  watch,
  provide,
  ComponentInternalInstance,
  computed,
  inject
} from 'vue';
import {
  BsSize,
  FormItemContext,
  ValidateStatus,
  formItemContextKey
} from '@/ts-tokens/bootstrap';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  SelectContext,
  SelectOptionItem,
  selectContextKey
} from '@/ts-tokens/bootstrap/select';
import { useDeliverContextToParent } from '@/hooks/useDeliverContextToParent';
import BsSelectInput from '../bs-select-input/BsSelectInput.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsSpinner from '../bs-spinner/BsSpinner.vue';
import BsOption from './widgets/BsOption.vue';
import BsOptionGroup from './widgets/BsOptionGroup.vue';
import { bsSelectProps } from './props';

let selectCount = 0;
export default defineComponent({
  name: 'BsSelect',
  components: {
    BsSelectInput,
    BsDropdownTransition,
    BsSpinner,
    BsOptionGroup,
    BsOption
  },
  props: {
    ...bsSelectProps
  },
  emits: ['update:modelValue', 'change', 'selectLimit'],
  setup (props: any, ctx: any) {
    let bsSelectRef = ref<HTMLElement|null>(null);
    let bsInputRef = ref<ComponentInternalInstance|null>(null);
    let bsSelectInputRef = ref<ComponentInternalInstance|null>(null);
    let bsSelectDropdownRef = ref<HTMLElement|null>(null);
    let dropdownTransitionRef = ref(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let selectId = ref(props.id || `bs-select_${++selectCount}`);
    let dropdownDisplayed = ref(false); // 下拉菜单是否已经渲染
    let dropdownVisible = ref(false); // 下拉菜单是否显示
    let optionItems = ref<SelectOptionItem[]>([]); // 存储option的label及value
    let formItemContext = inject<FormItemContext|null>(formItemContextKey, null);

    let nativeSelectModel = computed({
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
        (bsSelectInputRef.value as any)?.focus();
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
        (bsSelectInputRef.value as any)?.blur();
      }, 120);
    };

    /**
     * 调用当前<bs-form-item>父组件的方法
     * @param fnName 方法名称
     * @param args 参数
     */
    let callFormItem = function (fnName: string, ...args: any) {
      nextTick(function () {
        if (formItemContext) {
          (formItemContext as any)[fnName](...args);
        }
      });
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
    let addOption = function (option: SelectOptionItem) {
      let optionExists = optionItems.value.some((optionItem: SelectOptionItem) => optionItem.id === option.id);
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
      let index = optionItems.value.findIndex((optionItem: SelectOptionItem) => optionItem.id === optionId);
      if (index > -1) {
        optionItems.value.splice(index, 1);
        // console.log('removeOption changeVal', optionValue);
        changeVal(optionValue, true);
      }
    };

    /* let viewText = computed(function () {
      let modelValue = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
      let selectedOptionLabels = optionItems.value.filter(function (option: SelectOptionItem) {
        // console.log('option.value', option.value);
        return modelValue.includes(option.value);
      }).map(function (option: SelectOptionItem) {
        return option.label || (option as any).labelSlot;
      });
      // console.log('selectedOptionLabels', selectedOptionLabels);
      return selectedOptionLabels.join(',');
    }); */
    let viewText = computed(function () {
      let modelValue = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
      let selectedOptionLabels = optionItems.value.filter(function (option: SelectOptionItem) {
        // console.log('option.value', option.value);
        return modelValue.includes(option.value);
      }).map(function (option: SelectOptionItem) {
        let newOption = {
          ...option,
          label: option.label || option.labelSlot
        };
        return newOption;
      });
      // console.log('selectedOptionLabels', selectedOptionLabels);
      return selectedOptionLabels;
    });

    let isClickOutside = useClickOutside([bsSelectRef, bsSelectDropdownRef]);
    watch(isClickOutside, (newVal: boolean) => {
      // console.log('isClickOutside', isClickOutside.value);
      if (newVal) {
        dropdownHide();
      }
    });

    // 输入框点击事件
    let onSelectInputClick = function () {
      if (props.disabled) {
        return;
      }
      if (dropdownVisible.value) {
        if (!props.multiple) {
          dropdownHide();
        } else {
          (bsSelectInputRef.value as any)?.focus();
        }
      } else {
        dropdownShow();
      }
    };

    // 标签关闭事件
    let onTagClose = function (option: SelectOptionItem) {
      changeVal(option.value, true);
    };

    let filterText = ref('');
    // 搜索文本change事件
    let onFilterTextChange = function (searchText: string) {
      console.log('搜索文本：', searchText);
      filterText.value = searchText;
    };
    // 默认的搜索函数
    let filterMethodInner = function (option: SelectOptionItem) {
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
    let onSelectInputClear = function () {
      let val = props.multiple ? [] : '';
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
    };

    if (props.deliveContextToFormItem) {
      // 传递给<bs-form-item>组件的参数
      let deliverToFormItemCtx = {
        id: selectId.value,
        setValidateStatus: (status: ValidateStatus) => {
          // console.log('调select组件的setValidateStatus方法l');
          if (bsInputRef.value) {
            (bsInputRef.value as any).setValidateStatus(status);
          }
        }
      };
      // 如果当前组件处在<bs-form-item>组件中，则将setValidateStatus方法存储到<bs-form-item>组件中
      useDeliverContextToParent<FormItemContext>(formItemContextKey, deliverToFormItemCtx);
    }

    provide<SelectContext>(selectContextKey, reactive({
      props,
      ctx,
      filterText,
      // 给 option 子组件调用
      filterMethod: computed(function () {
        let filterMethod = props.filterMethod;
        if (typeof filterMethod === 'function') {
          return filterMethod;
        };
        return filterMethodInner;
      }),
      changeVal,
      addOption,
      removeOption
    }));
    // provide('parentCtx', { ctx });
    return {
      bsSelectRef,
      bsInputRef,
      bsSelectInputRef,
      bsSelectDropdownRef,
      dropdownTransitionRef,
      bsInputReadonly,
      isFocus,
      selectId,
      dropdownDisplayed,
      dropdownVisible,
      optionItems,
      nativeSelectModel,
      viewText,

      // onSelectRootClick,
      onSelectInputClear,
      dropdownShow,
      dropdownHide,

      onSelectInputClick,
      onTagClose,
      onFilterTextChange
    };
  }
});
</script>

<style lang="scss">
@import "bs-select";
</style>
