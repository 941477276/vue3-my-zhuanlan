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
        :delive-context-to-form-item="false"></BsCheckbox>
      <BsRadio
        v-if="!multiple && checkStrictly"
        :delive-context-to-form-item="false"></BsRadio>
      <div class="bs-cascader-menu-item-label">{{ item.label }}</div>
      <BsIcon
        v-if="item.children?.length > 0"
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
  CascaderExpandedMenuItem
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
    checkedMenuValues: {
      type: Array,
      default () {
        return [];
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

    // 判断是否选中了
    let getIsChecked = function (optionItem: CascaderOptionItem) {
      return props.checkedMenuValues?.includes(optionItem.value);
    };

    let setChecked = function (optionItem: CascaderOptionItem) {
      ctx.emit('item-checked', optionItem, cascaderMenuId);
      ctx.emit('item-change', optionItem, cascaderMenuId);
    };

    let handlerItemClick = function (optionItem: CascaderOptionItem) {
      if (optionItem.disabled) {
        return;
      }
      if (!optionItem.children || optionItem.children.length == 0) {
        setChecked(optionItem);
        return;
      }
      ctx.emit('item-click', optionItem, cascaderMenuId);
    };
    let handlerItemMousehover = function (optionItem: CascaderOptionItem, eventType: string) {
      if (optionItem.disabled) {
        return;
      }
      ctx.emit(`item-${eventType}`, optionItem, cascaderMenuId);
    };
    return {
      cascaderMenuId,

      getIsActive,
      getIsChecked,
      handlerItemClick,
      handlerItemMousehover
    };
  }
});
</script>
