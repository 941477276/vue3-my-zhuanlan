import {
  ComputedRef,
  Ref,
  ref
} from 'vue';
import {
  CascaderOptionItem,
  CascaderExpandedMenuItem,
  CascaderFieldNames
} from '@/ts-tokens/bootstrap/cascader';
import {
  findParentsByNodeValue2
} from '@/components/bootstrap/bs-tree/bs-tree-utils';
import { BsNodeInfo } from '@/ts-tokens/bootstrap/tree';

export function useCascaderMenu (props: any, ctx: any, fieldNameProps: ComputedRef<CascaderFieldNames>, flatternOptions: Ref<BsNodeInfo[]>, cascaderId: string) {
  // 展开的菜单options
  let expandedMenus = ref<CascaderExpandedMenuItem[]>([{
    menuId: 'bs-cascader-menu_1',
    menuItemValue: '',
    menuOptions: props.options
  }]);
  // 选中项列表
  let checkedOptions = ref<any>({});

  // 添加菜单到展开列表
  let pushMenuToExpanded = function (menuOption: any, cascaderMenuId: string) {
    let { children: childrenKey, value: valueKey } = fieldNameProps.value;
    let menuChildren = menuOption[childrenKey];
    if (menuChildren && menuChildren.length > 0) {
      let index = expandedMenus.value.findIndex(menuItem => menuItem.menuId === cascaderMenuId);
      let newMenu = {
        menuId: cascaderMenuId,
        menuItemValue: menuOption[valueKey],
        menuOptions: menuChildren
      };
      if (index > -1) {
        let removeCount = expandedMenus.value.length - index;
        if (cascaderMenuId === 'bs-cascader-menu_1') {
          expandedMenus.value[0].menuItemValue = menuOption[valueKey];
          newMenu.menuItemValue = '';
          // 如果当前展开的是第一个菜单的子菜单，则将当前菜单后面到菜单都移除掉，并替换成新的菜单
          expandedMenus.value.splice(index + 1, removeCount, newMenu);
        } else {
          // 将当前菜单及起后面的菜单都移除掉，并替换成新的菜单
          expandedMenus.value.splice(index, removeCount, newMenu);
        }
      } else {
        expandedMenus.value.push(newMenu);
      }
    }
  };

  /**
   * 添加选中项
   * @param optionItem 选中option
   */
  let setOptionChecked = function (optionItem: any) {
    let { value: valueKey, disabled: disabledKey } = fieldNameProps.value;
    let value = optionItem[valueKey];
    if (optionItem[disabledKey]) {
      return;
    }
    // 获取当前option的所有父级节点
    let findOptionParents = function () {
      let optionParentNodeInfos = findParentsByNodeValue2(cascaderId, value, valueKey, flatternOptions.value);
      let optionParents = optionParentNodeInfos.map((nodeInfo: BsNodeInfo) => {
        return nodeInfo.node;
      }) as CascaderOptionItem[];
      optionParents.reverse();
      console.log('optionParents', optionParents);
      return optionParents;
    };
    if (!props.multiple) {
      if (!props.emitPath) {
        checkedOptions.value = {
          [value]: [optionItem]
        };
      } else {
        let optionParents = findOptionParents();
        optionParents.push(optionItem);
        checkedOptions.value = {
          [value]: optionParents
        };
        console.log('values', optionParents);
      }
    } else {
      let optionParents = findOptionParents();
      optionParents.push(optionItem);
      if (props.checkStrictly) {
        console.log('多选，任意多选');
        checkedOptions.value[value] = optionParents;
      } else {
        console.log('多选，很麻烦多处理');
      }
    }
    let newModelValue = Object.values(checkedOptions.value).map((checkedOptionItem: any) => {
      return checkedOptionItem[valueKey];
    });
      // checkedOptions.value.map((checkedOptionItem: any) => checkedOptionItem[valueKey]);
    ctx.emit('update:modelValue', newModelValue);
  };

  let removeCheckedOption = function (optionItem: any) {
    let { value: valueKey, disabled: disabledKey } = fieldNameProps.value;
    let value = optionItem[valueKey];
    if (optionItem[disabledKey]) {
      return;
    }
    let checkedOptionsList = checkedOptions.value;
    let index = checkedOptionsList.findIndex((checkedOptionItem: any) => {
      return checkedOptionItem[valueKey] === value;
    });
    if (index == -1) {
      return;
    }
    if (!props.multiple) {
      checkedOptions.value = [];
    } else {
      if (props.checkStrictly) {
        checkedOptionsList.splice(index, 1);
      }
    }
  };

  let handleMenuItemClick = function (menu: CascaderOptionItem, cascaderMenuId: string) {
    console.log('菜单项点击了：', menu, cascaderMenuId);
    pushMenuToExpanded(menu, cascaderMenuId);
  };

  let handleMenuItemChecked = function (optionItem: CascaderOptionItem, cascaderMenuId: string, isAdd: boolean|undefined) {
    console.log('菜单选中了', optionItem, cascaderMenuId);
    /* let { value: valueKey } = fieldNameProps.value;
    let value = (optionItem as any)[valueKey];
    if (!props.multiple) {
      checkedMenuValues.value = [value];
    } else if (!checkedMenuValues.value.includes(value)) {
      checkedMenuValues.value.push(value);
    } */
    if (typeof isAdd === 'undefined' || !!isAdd) {
      setOptionChecked(optionItem);
    } else {

    }
  };

  return {
    expandedMenus,
    checkedOptions,
    handleMenuItemClick,
    handleMenuItemChecked
  };
};
