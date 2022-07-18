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
    @click="onSelectRootClick">
    <select
      v-model="nativeSelectModel"
      :name="name"
      :multiple="multiple"
      style="display: none;">
      <option
        v-for="item in options"
        :key="item.id"
        :value="item.value"
        :disabled="item.disabled">{{ item.label || item.labelSlot }}</option>
    </select>
    <bs-input
      ref="bsInputRef"
      :disabled="disabled || loading"
      :readonly="bsInputReadonly"
      :clearable="clearable"
      :id="selectId"
      :value="viewText"
      :size="size"
      :delive-context-to-form-item="false"
      :placeholder="loading ? loadingText : placeholder"
      :ariaLabel="ariaLabel"
      @clear="onInputClear">
      <template #suffix>
        <bs-icon name="chevron-down"></bs-icon>
      </template>
    </bs-input>
    <!-- 这里不能使用延迟渲染的方案，因为这会导致子组件也延迟渲染，从而导致上面的<select>标签不能在组件渲染时就生成
      <teleport to="body" v-if="dropdownDisplayed">-->
    <teleport :disabled="!teleported" :to="appendTo">
      <BsDropdownTransition
        placement="bottom"
        :reference-ref="bsSelectRef"
        :try-all-placement="false">
        <ul
          v-show="dropdownVisible"
          ref="bsSelectDropdownRef"
          class="bs-select-dropdown"
          :class="{
            'is-multiple': multiple
          }"
          :data-for-bs-select="selectId">
          <slot></slot>
          <li
            v-if="options.length == 0"
            class="bs-select-empty">
            <slot name="empty">{{ noDataText }}</slot>
          </li>
        </ul>
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
import BsInput from '../bs-input/BsInput.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import { bsSelectProps } from './props';

let selectCount = 0;
export default defineComponent({
  name: 'BsSelect',
  components: {
    BsInput,
    BsDropdownTransition
  },
  props: {
    ...bsSelectProps
  },
  emits: ['update:modelValue', 'change', 'selectLimit'],
  setup (props: any, ctx: any) {
    let bsSelectRef = ref<HTMLElement|null>(null);
    let bsInputRef = ref<ComponentInternalInstance|null>(null);
    let bsSelectDropdownRef = ref<HTMLElement|null>(null);
    let bsInputReadonly = ref(true);
    let isFocus = ref(false);
    let selectId = ref(props.id || `bs-select_${++selectCount}`);
    let dropdownDisplayed = ref(false); // 下拉菜单是否已经渲染
    let dropdownVisible = ref(false); // 下拉菜单是否显示
    let options = ref<SelectOptionItem[]>([]); // 存储option的label及value
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
      let optionExists = options.value.some((optionItem: SelectOptionItem) => optionItem.id === option.id);
      // console.log('optionExists', optionExists);
      if (!optionExists) {
        options.value.push(option);
      }
    };
    /**
     * 移除option
     * @param option
     */
    let removeOption = function (optionId: string, optionValue: any) {
      let index = options.value.findIndex((optionItem: SelectOptionItem) => optionItem.id === optionId);
      if (index > -1) {
        options.value.splice(index, 1);
        // console.log('removeOption changeVal', optionValue);
        changeVal(optionValue, true);
      }
    };

    let viewText = computed(function () {
      let modelValue = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
      let selectedOptionLabels = options.value.filter(function (option: SelectOptionItem) {
        // console.log('option.value', option.value);
        return modelValue.includes(option.value);
      }).map(function (option: SelectOptionItem) {
        return option.label || (option as any).labelSlot;
      });
      // console.log('selectedOptionLabels', selectedOptionLabels);
      return selectedOptionLabels.join(',');
    });
    watch([() => props.clearable, viewText], function (newVals: any[]) {
      (bsInputRef.value as any).setClearIconDisplay(newVals[0] && newVals[1].length > 0);
    });

    let isClickOutside = useClickOutside([bsSelectRef, bsSelectDropdownRef]);
    watch(isClickOutside, (newVal: boolean) => {
      // console.log('isClickOutside', isClickOutside.value);
      if (newVal) {
        dropdownHide();
      }
    });

    let onSelectRootClick = function () {
      if (props.disabled || props.loading) {
        return;
      }
      if (dropdownVisible.value) {
        dropdownHide();
      } else {
        isFocus.value = true;
        dropdownShow();
      }
    };

    // 清空内容
    let onInputClear = function () {
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
      changeVal,
      addOption,
      removeOption
    }));
    return {
      bsSelectRef,
      bsInputRef,
      bsSelectDropdownRef,
      bsInputReadonly,
      isFocus,
      selectId,
      dropdownDisplayed,
      dropdownVisible,
      options,
      nativeSelectModel,
      viewText,

      onSelectRootClick,
      onInputClear,
      dropdownShow,
      dropdownHide
    };
  }
});
</script>

<style lang="scss">
@import "bs-select";
</style>
