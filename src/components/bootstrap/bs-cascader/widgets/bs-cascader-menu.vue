<template>
  <ul
    class="bs-cascader-menu"
    :data-cascader-menu-id="cascaderMenuId"
    role="menu">
    <li
      class="bs-cascader-menu-item"
      v-for="item in options"
      :key="item.value"
      :class="[
        {
          'is-disabled': item.disabled,
          'is-multiple': multiple
        },
        getClassnames(item)
      ]"
      @click="handlerItemClick(item, $event)"
      @mouseenter="handlerItemMousehover(item, 'mouseenter')"
      @mouseleave="handlerItemMousehover(item, 'mouseleave')">
      <BsCheckbox
        v-if="multiple"
        :data-model-value11="formInputValue"
        :model-value="getCheckboxInputValue(item)"
        :value="item[fieldNames.value]"
        :name="checkboxName || (cascaderId + '_checkbox')"
        :disabled="item[fieldNames.disabled]"
        :delive-context-to-form-item="false"
        :indeterminate="getIsIndeterminate(item)"
        @change="handleCheckboxChange(item, $event)"></BsCheckbox>
      <BsRadio
        v-if="!multiple && checkStrictly"
        :model-value="formInputValue"
        :name="radioName || (cascaderId + '_radio')"
        :disabled="item[fieldNames.disabled]"
        :value="item[fieldNames.value]"
        :delive-context-to-form-item="false"
        @change="setChecked(item)"></BsRadio>
      <div class="bs-cascader-menu-item-label">{{ item.label }}</div>
      <BsIcon
        v-if="getHasChildren(item)"
        name="chevron-right"></BsIcon>
      <bs-icon
        v-if="!multiple && !checkStrictly"
        name="check-lg"
        class="bs-cascader-check-icon"></bs-icon>
    </li>
  </ul>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref
} from 'vue';
import BsCheckbox from '../../bs-checkbox/BsCheckbox.vue';
import BsRadio from '../../bs-radio/BsRadio.vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import {
  cascaderMenuProps
} from './cascader-menu-props';
import {
  CascaderOptionItem,
  CascaderExpandedMenuItem,
  CascaderFieldNames
} from '@/ts-tokens/bootstrap/cascader';
import { util } from '@/common/util';

let cascaderMenuCount = 0;
export default defineComponent({
  name: 'bs-cascader-menu',
  components: {
    BsCheckbox,
    BsRadio,
    BsIcon
  },
  props: {
    options: {
      type: Array,
      default () {
        return [];
      }
    },
    cascaderSlots: { // 父组件的插槽上下文
      type: Object,
      default: null
    },
    expandedMenus: {
      type: Array as PropType<CascaderExpandedMenuItem[]>,
      default () {
        return [];
      }
    },
    checkedOptions: { // 选中节点列表
      type: Object,
      default () {
        return {};
      }
    },
    halfCheckedOptions: { // 半选中节点列表，只在多选时有效
      type: Object,
      default () {
        return {};
      }
    },
    fieldNames: { // 自定义 options 中 label、 children、disabled 的字段名称
      type: Object as PropType<CascaderFieldNames>,
      default () {
        return {};
      }
    },
    cascaderId: {
      type: String,
      default: ''
    },
    ...cascaderMenuProps
  },
  emits: ['item-click', 'item-mouseenter', 'item-mouseleave', 'item-checked', 'item-change'],
  setup (props: any, ctx: any) {
    let cascaderMenuId = `bs-cascader-menu_${++cascaderMenuCount}`;

    // 是否有子options
    let getHasChildren = function (optionItem: any) {
      let children = optionItem[props.fieldNames.children];
      return Array.isArray(children) && children.length > 0;
    };

    let getIsInclude = function (optionItem: any) {
      let { value: valueKey } = props.fieldNames;
      let value = optionItem[valueKey];
      let isInclude = Object.values(props.checkedOptions).some(function (checkedOptionList) {
        return (checkedOptionList as CascaderOptionItem[]).some((checkedOption: any) => checkedOption[valueKey] === value);
      });
      return isInclude;
    };

    // 设置classname
    let getClassnames = function (optionItem: any) {
      let classlist: string[] = [];
      let { value: valueKey } = props.fieldNames;
      let value = optionItem[valueKey];
      let isChecked = !!props.checkedOptions[value];
      let isInclude = getIsInclude(optionItem);
      let isExpanded = props.expandedMenus?.some((menuItem: CascaderExpandedMenuItem) => {
        return menuItem.menuId === cascaderMenuId && menuItem.menuItemValue === value;
      });

      if (props.multiple) {
        /* if (props.checkStrictly) {
          isChecked = isInclude;
        } */
        // isChecked =  true;
      } else {
        let hasChildren = getHasChildren(optionItem);
        if (hasChildren && !props.checkStrictly) {
          isChecked = false;
        }
        // isChecked = isInclude;
      }
      if (isExpanded) {
        classlist.push('is-expanded');
      }
      if (isInclude) {
        classlist.push('is-actived');
      }
      if (isChecked) {
        classlist.push('is-checked');
      }
      return classlist;
    };

    let setChecked = function (optionItem: CascaderOptionItem) {
      ctx.emit('item-checked', optionItem, cascaderMenuId);
      ctx.emit('item-change', optionItem, cascaderMenuId);
    };
    let removeChecked = function (optionItem: CascaderOptionItem) {
      ctx.emit('item-checked', optionItem, cascaderMenuId, false);
      ctx.emit('item-change', optionItem, cascaderMenuId, false);
    };

    // 复选框是否为半选中状态
    let getIsIndeterminate = function (optionItem: CascaderOptionItem) {
      let {
        value: valueKey
      } = props.fieldNames;
      return (optionItem as any)[valueKey] in props.halfCheckedOptions;
    };

    // 复选框的值
    let getCheckboxInputValue = function (optionItem: CascaderOptionItem) {
      // let keys = Object.keys(props.checkedOptions);
      if (props.multiple && props.checkStrictly) {
        return Object.keys(props.checkedOptions);
      }
      let { value: valueKey } = props.fieldNames;
      let value = (optionItem as any)[valueKey];
      let isIndeterminate = getIsIndeterminate(optionItem);
      let isInclude = getIsInclude(optionItem);
      let result = isInclude && !isIndeterminate ? [value] : [];
      return result;
    };

    let formInputValue = computed(function () {
      let keys = Object.keys(props.checkedOptions);
      return props.multiple ? keys : keys[0];
    });
    // 多选框值改变事件
    let handleCheckboxChange = function (optionItem: CascaderOptionItem, evt: InputEvent) {
      console.log('多选框值改变事件', optionItem, (evt.target as HTMLInputElement).checked);
      let isChecked = (evt.target as HTMLInputElement).checked;
      isChecked ? setChecked(optionItem) : removeChecked(optionItem);
    };

    let handlerItemClick = function (optionItem: any, evt: MouseEvent) {
      let {
        children: childrenKey,
        value: valueKey,
        disabled: disabledKey
      } = props.fieldNames;
      let target = evt.target as HTMLElement;
      // 防止点击复选框、单选框后造成重复点击！
      if (target.nodeName === 'INPUT' && util.hasClass(target, 'form-check-input')) {
        return;
      }
      if (optionItem[disabledKey] || props.expandTrigger !== 'click') {
        return;
      }
      let multiple = props.multiple;
      // 如果显示了复选框或单选框则不允许选中
      if (multiple || (!multiple && props.checkStrictly)) {
        ctx.emit('item-click', optionItem, cascaderMenuId);
        return;
      }
      if (!optionItem[childrenKey] || optionItem[childrenKey].length == 0) {
        setChecked(optionItem);
        return;
      }
      ctx.emit('item-click', optionItem, cascaderMenuId);
    };
    let handlerItemMousehover = function (optionItem: any, eventType: string) {
      let { disabled: disabledKey } = props.fieldNames;

      if (optionItem[disabledKey] || props.expandTrigger !== 'hover') {
        return;
      }
      ctx.emit(`item-${eventType}`, optionItem, cascaderMenuId);
    };
    return {
      cascaderMenuId,
      formInputValue,
      getHasChildren,
      getClassnames,
      getIsIndeterminate,
      getCheckboxInputValue,

      setChecked,
      handlerItemClick,
      handlerItemMousehover,
      handleCheckboxChange
    };
  }
});
</script>
