<template>
  <ul
    class="bs-cascader-menu"
    :data-cascader-menu-id="cascaderMenuId"
    role="menu">
    <li
      class="bs-cascader-menu-item"
      v-for="item in options"
      :key="item.value"
      :class="{
        'is-disabled': item.disabled,
        'is-checked': getIsChecked(item),
        'is-expanded': getIsActive(item)
      }"
      @click="handlerItemClick(item)"
      @mouseenter="handlerItemMousehover(item, 'mouseenter')"
      @mouseleave="handlerItemMousehover(item, 'mouseleave')">
      <BsCheckbox
        v-if="multiple"
        :name="cascaderMenuId + '_checkbox'"
        :disabled="item[fieldNames.disabled]"
        :value="item[fieldNames.value]"
        :delive-context-to-form-item="false"></BsCheckbox>
      <BsRadio
        v-if="!multiple && checkStrictly"
        :name="cascaderMenuId + '_radio'"
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
  computed
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
    checkedOptions: {
      type: Array,
      default () {
        return [];
      }
    },
    fieldNames: { // 自定义 options 中 label、 children、disabled 的字段名称
      type: Object as PropType<CascaderFieldNames>,
      default () {
        return {};
      }
    },
    ...cascaderMenuProps
  },
  emits: ['item-click', 'item-mouseenter', 'item-mouseleave', 'item-checked', 'item-change'],
  setup (props: any, ctx: any) {
    let cascaderMenuId = `bs-cascader-menu_${++cascaderMenuCount}`;

    // 判断是否展开
    let getIsActive = function (optionItem: CascaderOptionItem) {
      let optionItemValue = optionItem.value;
      let flag = props.expandedMenus?.some((menuItem: CascaderExpandedMenuItem) => {
        return menuItem.menuId === cascaderMenuId && menuItem.menuItemValue === optionItemValue;
      });
      return flag;
    };

    // 是否有子options
    let getHasChildren = function (optionItem: any) {
      let children = optionItem[props.fieldNames.children];
      return Array.isArray(children) && children.length > 0;
    };

    // 判断是否选中了
    let getIsChecked = function (optionItem: any) {
      let { value: valueKey } = props.fieldNames;
      let value = optionItem[valueKey];
      let isInclude = props.checkedOptions?.some((checkedOptionItem: any) => {
        // console.log('checkedOptionItem[valueKey]:', checkedOptionItem[valueKey], value);
        return checkedOptionItem[valueKey] === value;
      });
      if (props.multiple) {
        return true;
      } else {
        let hasChildren = getHasChildren(optionItem);
        if (hasChildren) {
          return false;
        }
        return isInclude;
      }
    };

    let setChecked = function (optionItem: CascaderOptionItem) {
      ctx.emit('item-checked', optionItem, cascaderMenuId);
      ctx.emit('item-change', optionItem, cascaderMenuId);
    };

    let handlerItemClick = function (optionItem: any) {
      let { children: childrenKey, value: valueKey, disabled: disabledKey } = props.fieldNames;

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
      getHasChildren,

      setChecked,
      getIsActive,
      getIsChecked,
      handlerItemClick,
      handlerItemMousehover
    };
  }
});
</script>
