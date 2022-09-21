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
      :suffix-icon="suffixIcon"
      @click="onCascaderInputClick"
      @tag-close="onTagClose"
      @filter-text-change="onFilterTextChange"
      @clear="onCascaderInputClear"></BsSelectInput>
    <div
      ref="cascaderMenusRef"
      class="bs-cascader-menus">
      <BsCascaderMenu
        v-for="menuItem in expandedMenus"
        :key="menuItem.menuId"
        :options="menuItem.menuOptions"
        :multiple="multiple"
        :check-strictly="checkStrictly"
        :expand-trigger="expandTrigger"
        :expand-icon="expandIcon"
        :lazy="lazy"
        :lazy-load-fn="lazyLoadFn"
        :cascader-slots="$slots"
        :expanded-menus="expandedMenus"
        :checked-options="checkedOptions"
        :field-names="fieldNameProps"
        :cascader-id="cascaderId"
        :half-checked-options="halfCheckedOptions"
        @item-open="handleMenuItemOpen"
        @item-checked="handleMenuItemChecked"></BsCascaderMenu>
      <!--<BsCascaderMenu></BsCascaderMenu>
      <BsCascaderMenu></BsCascaderMenu>-->
    </div>
    <teleport :disabled="!teleported" :to="appendTo">
      <BsDropdownTransition
        v-if="dropdownDisplayed"
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
  nextTick,
  provide,
  reactive,
  ref,
  watch,
  onUnmounted
} from 'vue';
import {
  NOOP,
  isFunction
} from '@vue/shared';
import BsSelectInput from '../bs-select-input/BsSelectInput.vue';
import BsDropdownTransition from '../bs-dropdown-transition/BsDropdownTransition.vue';
import BsCascaderMenu from './widgets/bs-cascader-menu.vue';
import { bsCascaderProps } from './props';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDeliverContextToFormItem } from '@/hooks/useDeliverContextToFormItem';
import { ValidateStatus } from '@/ts-tokens/bootstrap';
import {
  CascaderOptionItem,
  CascaderExpandedMenuItem,
  CascaderFieldNames
} from '@/ts-tokens/bootstrap/cascader';
import { SelectContext, selectContextKey } from '@/ts-tokens/bootstrap/select';
import { useDropdown } from './useDropdown';
import { useCascaderMenu } from './useCascaderMenu';
import {
  treeDataToFlattarnArr2,
  clearCachedNodeInfo
} from '@/components/bootstrap/bs-tree/bs-tree-utils';
import {
  BsNodeInfo
} from '@/ts-tokens/bootstrap/tree';

const defaultFieldNames: CascaderFieldNames = {
  label: 'label',
  children: 'children',
  disabled: 'disabled',
  value: 'value',
  leaf: 'leaf'
};
let cascaderCount = 0;
export default defineComponent({
  name: 'BsCascader',
  props: {
    ...bsCascaderProps,
    fieldNames: { // 自定义 options 中 label、 children、disabled 的字段名称
      type: Object,
      default () {
        return {};
      }
    }
  },
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
    let cascaderMenusRef = ref<HTMLElement|null>(null);
    let dropdownTransitionRef = ref(null);
    let bsInputReadonly = ref(true);
    let cascaderId = ref(props.id || `bs-cascader_${++cascaderCount}`);
    let optionItems = ref<CascaderOptionItem[]>([]); // 存储option的label及value

    // 展开的菜单options
    let expandedMenus = ref<CascaderExpandedMenuItem[]>([/* {
      menuId: 'bs-cascader-menu_1',
      menuItemValue: '',
      menuOptions: props.options
    } */]);

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

    // options 中 label、 children、disabled 的字段名称
    let fieldNameProps = computed<CascaderFieldNames>(function () {
      return {
        ...(props.fieldNames || {}),
        ...defaultFieldNames
      };
    });

    // 扁平化的options
    let flatternOptions = ref<BsNodeInfo[]>([]);
    watch(() => props.options, function (newOptions: CascaderOptionItem[]) {
      let { children: childrenKey, value: valueKey, disabled: disabledKey } = fieldNameProps.value;
      let flatternArr = treeDataToFlattarnArr2(cascaderId, newOptions as BsNodeInfo[], childrenKey, disabledKey, 1, '', []);
      console.log('扁平化的options', flatternArr);
      /* console.log('扁平化的options值', flatternArr.map((item: any) => {
        return item.node.value;
      })); */
      flatternOptions.value = flatternArr;
      if (!expandedMenus.value[0]) {
        expandedMenus.value[0] = {
          menuId: 'bs-cascader-menu_1',
          menuItemValue: '',
          menuOptions: newOptions
        };
      } else {
        expandedMenus.value[0].menuOptions = newOptions;
      }
      let timer = setTimeout(function () {
        clearTimeout(timer);
        let flatternArrValues = flatternArr.map(nodeItem => nodeItem.node[valueKey]);
        let expandedMenusNotInNewOptionsIndex = expandedMenus.value.findIndex(expandedMenuItem => {
          let menuItemValue = expandedMenuItem.menuItemValue;
          return menuItemValue != '' && !flatternArrValues.includes(expandedMenuItem.menuItemValue);
        });
        // 防止options更新后之前展开的option不存在而导致界面出错问题
        if (expandedMenusNotInNewOptionsIndex > -1) {
          if (expandedMenusNotInNewOptionsIndex == 0) {
            expandedMenus.value[0].menuItemValue = '';
          } else {
            expandedMenus.value.splice(expandedMenusNotInNewOptionsIndex);
          }
        }
      }, 0);
    }, {
      immediate: true,
      deep: true
    });

    let {
      isFocus,
      dropdownDisplayed,
      dropdownVisible,

      dropdownShow,
      dropdownHide
    } = useDropdown(props, bsCascaderInputRef);

    // 点击外部隐藏下拉
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
      let val: any[] = [];
      ctx.emit('update:modelValue', val);
      ctx.emit('change', val);
      callFormItem('validate', 'change');
    };

    // 向父级<bs-form-item>组件传递当前组件上下文信息
    let { callFormItem } = useDeliverContextToFormItem(props, {
      id: cascaderId.value,
      setValidateStatus: (status: ValidateStatus) => {
        // console.log('调select组件的setValidateStatus方法l');
        (bsCascaderInputRef.value as any)?.setValidateStatus(status);
      }
    });

    let {
      checkedOptions,
      halfCheckedOptions,
      removeCheckedOption,
      handleMenuItemOpen,
      handleMenuItemChecked
    } = useCascaderMenu(props, ctx, fieldNameProps, flatternOptions, expandedMenus, cascaderMenusRef, cascaderId);

    // 标签关闭事件
    let onTagClose = function (option: CascaderOptionItem) {
      console.log('标签关闭事件', option);
      removeCheckedOption(option);
    };

    // 用于显示的内容
    let viewText = computed(function () {
      let isMultiple = props.multiple;
      let checkedOptionList: CascaderOptionItem[][] = Object.values(checkedOptions.value);
      let labelKey = fieldNameProps.value.label;
      let valueKey = fieldNameProps.value.value;
      let disabledKey = fieldNameProps.value.disabled;
      let displayRender = props.displayRender;
      let result: { label: string; value: string|number, disabled: boolean }[] = [];
      if (checkedOptionList.length == 0) {
        return result;
      }
      if (isMultiple) {
        result = checkedOptionList.map(function (checkedOptionsPathList: any[]) {
          let label = '';
          let lastOption = checkedOptionsPathList[checkedOptionsPathList.length - 1];
          if (props.showAllLevels) {
            label = isFunction(displayRender) ? displayRender(checkedOptionsPathList) : checkedOptionsPathList.map(checkedOptionItem => {
              return checkedOptionItem[labelKey];
            }).join(' / ');
          } else {
            label = isFunction(displayRender) ? displayRender([lastOption]) : lastOption[labelKey];
          }
          let disabled = checkedOptionsPathList.some(checkedOptionItem => checkedOptionItem[disabledKey]);
          let value = lastOption[valueKey];
          return {
            value,
            label,
            disabled
          };
        });
      } else {
        let obj = { label: '', value: '', disabled: false };
        let text = '';
        let checkedOptionList2 = checkedOptionList[0];
        let lastOption: any = checkedOptionList2[checkedOptionList2.length - 1] || {};
        if (props.showAllLevels) {
          text = isFunction(displayRender) ? displayRender(checkedOptionList2) : checkedOptionList2.map((optionItem: any) => {
            return optionItem[labelKey];
          }).join(' / ');
        } else {
          text = isFunction(displayRender) ? displayRender([lastOption]) : lastOption[labelKey];
        }
        obj.label = text;
        obj.value = lastOption[valueKey];
        obj.disabled = lastOption[disabledKey];
        result.push(obj);
      }
      return result;
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

    onUnmounted(function () {
      clearCachedNodeInfo(cascaderId);
    });

    return {
      bsCascaderRef,
      bsCascaderInputRef,
      bsCascaderDropdownRef,
      dropdownTransitionRef,
      cascaderMenusRef,
      bsInputReadonly,
      isFocus,
      cascaderId,
      dropdownDisplayed,
      dropdownVisible,
      optionItems,
      nativeCascaderModel,
      viewText,
      fieldNameProps,

      // onCascaderRootClick,
      onCascaderInputClear,
      dropdownShow,
      dropdownHide,

      onCascaderInputClick,
      onTagClose,
      onFilterTextChange,

      expandedMenus,
      checkedOptions,
      halfCheckedOptions,
      handleMenuItemOpen,
      handleMenuItemChecked
    };
  }
});
</script>

<style lang="scss">
@import "bs-cascader";
</style>
