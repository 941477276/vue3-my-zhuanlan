import {
  Ref,
  ref
} from 'vue';
import { CascaderOptionItem } from '@/ts-tokens/bootstrap/cascader';

export function useCascaderMenu (props: any, ctx: any, expandedMenus: Ref<CascaderOptionItem[][]>) {
  let handleMenuItemClick = function (optionItem: CascaderOptionItem, cascaderMenuId: string) {
    console.log('菜单项点击了：', optionItem, cascaderMenuId);
    let optionItemChildren = optionItem.children;
    if (optionItemChildren && optionItemChildren.length > 0) {
      expandedMenus.value.push(optionItemChildren);
    }
  };

  return {
    handleMenuItemClick
  };
};
