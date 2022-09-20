import {
  ComputedRef,
  Ref,
  ref,
  watch
} from 'vue';
import {
  isString,
  isArray
} from '@vue/shared';
import {
  CascaderOptionItem,
  CascaderExpandedMenuItem,
  CascaderFieldNames,
  CheckedOptions
} from '@/ts-tokens/bootstrap/cascader';
import { BsNodeInfo } from '@/ts-tokens/bootstrap/tree';
import {
  StringKeyObject
} from '@/ts-tokens/bootstrap';
import {
  findNodeInfoByValue2,
  findParentsByNodeValue2
} from '@/components/bootstrap/bs-tree/bs-tree-utils';
import {
  useCascaderMultiple
} from './useCascaderMultiple';

export function useCascaderMenu (props: any, ctx: any, fieldNameProps: ComputedRef<CascaderFieldNames>, flatternOptions: Ref<BsNodeInfo[]>, cascaderId: string) {
  // 展开的菜单options
  let expandedMenus = ref<CascaderExpandedMenuItem[]>([{
    menuId: 'bs-cascader-menu_1',
    menuItemValue: '',
    menuOptions: props.options
  }]);
  // 选中项列表
  let checkedOptions = ref<CheckedOptions>({});
  // 半选中列表
  let halfCheckedOptions = ref<StringKeyObject>({});
  // 存储最近一个更新给父组件的值
  let localModelValue: any[] = [];

  let {
    addMultipleOptionsChecked,
    removeMultipleOptionsChecked
  } = useCascaderMultiple(props, checkedOptions, halfCheckedOptions, fieldNameProps, flatternOptions, cascaderId);

  // 添加菜单到展开列表
  let pushMenuToExpanded = function (menuOption: any, cascaderMenuId: string) {
    let {
      children: childrenKey,
      value: valueKey
    } = fieldNameProps.value;
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

  // 更新父组件的值
  let updateModelValue = function () {
    let {
      value: valueKey,
      disabled: disabledKey
    } = fieldNameProps.value;
    let emitPath = props.emitPath;
    let checkedOptionsList = Object.values(checkedOptions.value) as CascaderOptionItem[][];
    if (checkedOptionsList.length == 0) {
      localModelValue = [];
      ctx.emit('update:modelValue', []);
      return;
    }
    let newModelValue = checkedOptionsList.map((checkedOptionItemListPath: any[]) => {
      let values = checkedOptionItemListPath.map(function (checkedOptionItem) {
        return checkedOptionItem[valueKey];
      });
      let result = emitPath ? values : [values[values.length - 1]];
      return result;
    });
    let modelValue;
    if (!props.multiple) {
      modelValue = newModelValue[0];
    } else {
      modelValue = newModelValue;
    }
    localModelValue = [...modelValue];
    ctx.emit('update:modelValue', modelValue);
  };

  /**
   * 添加选中项
   * @param optionItem 选中option
   * @param needUpdateModelValue 是否需要更新父组件的值
   */
  let addOptionChecked = function (optionItem: any, needUpdateModelValue = true) {
    let {
      value: valueKey,
      disabled: disabledKey,
      children: childrenKey
    } = fieldNameProps.value;
    let value = optionItem[valueKey];
    if (optionItem[disabledKey] && needUpdateModelValue) {
      return;
    }
    // 存在了就不再添加
    if (value in checkedOptions.value) {
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
    let optionParents = findOptionParents();
    optionParents.push(optionItem);
    if (!props.multiple) {
      checkedOptions.value = {
        [value]: optionParents
      };
      console.log('values', optionParents);
    } else {
      // let optionParents = findOptionParents();
      // optionParents.push(optionItem);
      if (props.checkStrictly) {
        console.log('多选，任意多选');
        checkedOptions.value[value] = optionParents;
      } else {
        console.log('多选，很麻烦多处理');
        addMultipleOptionsChecked(optionItem, !needUpdateModelValue);
      }
    }
    if (needUpdateModelValue || !props.multiple) {
      updateModelValue();
    }
  };

  /**
   * 移除选中项
   * @param optionItem 选中option
   * @param needUpdateModelValue 是否需要更新父组件的值
   */
  let removeCheckedOption = function (optionItem: any, needUpdateModelValue = true) {
    let {
      value: valueKey,
      disabled: disabledKey
    } = fieldNameProps.value;
    // let value = optionItem[valueKey];
    if (optionItem[disabledKey] && needUpdateModelValue) {
      return;
    }
    if (!props.multiple) {
      checkedOptions.value = {};
    } else {
      console.log('移除选中项，很麻烦');
      removeMultipleOptionsChecked(optionItem);
    }
    if (needUpdateModelValue) {
      updateModelValue();
    }
  };

  let handleMenuItemOpen = function (menu: CascaderOptionItem, cascaderMenuId: string) {
    console.log('菜单项点击了：', menu, cascaderMenuId);
    pushMenuToExpanded(menu, cascaderMenuId);
  };

  let handleMenuItemChecked = function (optionItem: CascaderOptionItem, cascaderMenuId: string, isAdd: boolean | undefined) {
    console.log('菜单选中了', optionItem, cascaderMenuId);
    if (typeof isAdd === 'undefined' || !!isAdd) {
      addOptionChecked(optionItem);
    } else {
      removeCheckedOption(optionItem);
    }
  };

  // 同步选中项列表
  watch(() => props.modelValue, function (modelValue: any) {
    let {
      multiple
    } = props;
    console.log('watch props.modelValue', localModelValue, modelValue);

    if (isString(modelValue)) {
      let optionValues = modelValue.split(',');
      if (!multiple) {
        modelValue = [optionValues[optionValues.length - 1]];
      }
    }
    if ([...localModelValue].sort().join(',') === [...modelValue].sort().join(',')) {
      console.log('本地值与父组件值一致，不执行同步');
      return;
    }
    let oldCheckedOptions = checkedOptions.value;
    let {
      value: valueKey,
      label: labelKey
    } = fieldNameProps.value;
    checkedOptions.value = {}; // 清空原来的选中项列表
    halfCheckedOptions.value = {};
    modelValue.forEach(function (item: string | number | (string | number)[]) {
      let optionValue: string | number;
      if (isArray(item)) { // 如果还是数组，则取数组最后一项的值，这样不管props.emitPath是否为true都不会取错值
        optionValue = item[item.length - 1];
      } else {
        optionValue = item;
      }
      let option: CascaderOptionItem;
      if (optionValue in oldCheckedOptions) {
        let oldCheckedOptionPath = oldCheckedOptions[optionValue];
        option = oldCheckedOptionPath[oldCheckedOptionPath.length - 1];
      } else {
        let currentOption = findNodeInfoByValue2(cascaderId, optionValue, valueKey, flatternOptions.value);
        if (!currentOption) { // 如果在节点列表没有找到该节点，则根据节点的值创建一个新节点
          option = {
            [labelKey]: optionValue,
            [valueKey]: optionValue
          };
        } else {
          option = currentOption.node;
        }
      }
      console.log('新的选中项', option);
      addOptionChecked(option, false);
    });
  }, {
    immediate: true,
    deep: true
  });

  return {
    expandedMenus,
    checkedOptions,
    halfCheckedOptions,
    removeCheckedOption,
    handleMenuItemOpen,
    handleMenuItemChecked
  };
};
