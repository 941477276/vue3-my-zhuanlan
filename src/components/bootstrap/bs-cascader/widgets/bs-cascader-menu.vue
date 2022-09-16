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
        'is-disabled': item.disabled
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
  defineComponent
} from 'vue';
import BsCheckbox from '../../bs-checkbox/BsCheckbox.vue';
import BsRadio from '../../bs-radio/BsRadio.vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import {
  cascaderMenuProps
} from './cascader-menu-props';
import {
  CascaderOptionItem
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
    ...cascaderMenuProps
  },
  emits: ['item-click', 'item-mouseenter', 'item-mouseleave'],
  setup (props: any, ctx: any) {
    let cascaderMenuId = `bs-cascader-menu_${++cascaderMenuCount}`;
    let handlerItemClick = function (optionItem: CascaderOptionItem) {
      if (optionItem.disabled) {
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

      handlerItemClick,
      handlerItemMousehover
    };
  }
});
</script>
