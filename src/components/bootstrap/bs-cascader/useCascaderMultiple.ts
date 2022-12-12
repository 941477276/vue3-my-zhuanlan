import {
  ComputedRef,
  Ref
} from 'vue';
import {
  isArray
} from '@vue/shared';
import {
  StringKeyObject
} from '@/ts-tokens/bootstrap';
import {
  CascaderFieldNames,
  CascaderOptionItem,
  CheckedOptions
} from '@/ts-tokens/bootstrap/cascader';
import { BsNodeInfo } from '@/ts-tokens/bootstrap/tree';
import {
  findParentsByNodeValue2,
  findChildrenByNodeValue2
} from '@/components/bootstrap/bs-tree/bs-tree-utils';

export function useCascaderMultiple (props:any, checkedOptions: Ref<CheckedOptions>, halfCheckedOptions: Ref<StringKeyObject>, fieldNameProps: ComputedRef<CascaderFieldNames>, flatternOptions: Ref<BsNodeInfo[]>, dropdownTransitionRef: Ref<any>, cascaderId: string) {
  let findOptionParents = function (value: string, valueKey: string) {
    let optionParentNodeInfos = findParentsByNodeValue2(cascaderId, value, valueKey, flatternOptions.value);
    let optionParents = optionParentNodeInfos.map((nodeInfo: BsNodeInfo) => {
      return nodeInfo.node;
    }) as CascaderOptionItem[];
    optionParents.reverse();
    console.log('optionParents', optionParents);
    return optionParents;
  };

  /**
   * 多选时添加节点进选中节点列表
   * @param optionItem 待添加节点
   * @param allowDisabledAdd 是否允许添加禁用的节点
   */
  let addMultipleOptionsChecked = function (optionItem: any, allowDisabledAdd = false) {
    let {
      value: valueKey,
      disabled: disabledKey,
      children: childrenKey
    } = fieldNameProps.value;
    if (optionItem[disabledKey] && !allowDisabledAdd) {
      return;
    }
    let value = optionItem[valueKey];
    let optionChildren = optionItem[childrenKey];
    let optionParents = findOptionParents(value, valueKey);

    if (props.checkStrictly) {
      console.log('多选，任意多选');
      checkedOptions.value[value] = optionParents;
    } else {
      if (!isArray(optionChildren) || optionChildren.length == 0) { // 节点没有子孙节点，直接添加进选中的节点列表
        if (!allowDisabledAdd) {
          let parentsHasDisabled = optionParents.some((parentItem: any) => parentItem[disabledKey]);
          if (parentsHasDisabled) {
            return;
          }
        }
        checkedOptions.value[value] = [...optionParents, optionItem];
      } else {
        // 找到节点的所有子孙节点
        let optionChildrens = findChildrenByNodeValue2(cascaderId, value, valueKey, childrenKey, flatternOptions.value);
        console.log('addMultipleOptionsChecked optionChildrens', optionChildrens);
        // 没有子孙节点的节点
        let optionPureChildrens: CascaderOptionItem[] = [];
        // 有子孙节点的节点
        let optionChildrensWhichHasChildren: CascaderOptionItem[] = [];
        optionChildrens.forEach(function (option: any) {
          let children = option[childrenKey];
          if (isArray(children) && children.length > 0) {
            optionChildrensWhichHasChildren.push(option);
          } else {
            optionPureChildrens.push(option);
          }
        });

        // 添加进选中的节点列表
        optionPureChildrens.forEach(function (optionPureItem: any) {
          if (optionPureItem[disabledKey]) { // 禁用项不添加进去
            return;
          }
          let value = optionPureItem[valueKey];
          let parents = findOptionParents(value, valueKey);
          if (!allowDisabledAdd) {
            let parentsHasDisabled = parents.some((parentItem: any) => parentItem[disabledKey]);
            if (parentsHasDisabled) { // 父级节点有禁用项也不允许添加进去
              return;
            }
          }
          parents.push(optionPureItem);
          checkedOptions.value[value] = parents;
        });

        optionParents = [...optionParents, optionItem, ...optionChildrensWhichHasChildren];
      }

      // 设置父级节点选中/半选中状态
      setParentsCheckedStatus(optionParents);
    }

    let timer = setTimeout(function () {
      clearTimeout(timer);
      dropdownTransitionRef.value?.refresh();
    }, 60);
  };

  /**
   * 多选时从选中节点列表中移除节点
   * @param optionItem 待移除节点
   * @param allowDisabledAdd 是否允许移除禁用的
   */
  let removeMultipleOptionsChecked = function (optionItem: any, allowDisabledAdd = false) {
    let {
      value: valueKey,
      disabled: disabledKey,
      children: childrenKey
    } = fieldNameProps.value;
    let value = optionItem[valueKey];
    if (optionItem[disabledKey] && !allowDisabledAdd) {
      return;
    }
    let optionChildren = optionItem[childrenKey];
    let optionParents = findOptionParents(value, valueKey);

    if (!isArray(optionChildren) || optionChildren.length == 0) { // 节点没有子孙节点，直接添加进选中的节点列表
      if (!allowDisabledAdd) {
        let parentsHasDisabled = optionParents.some((parentItem: any) => parentItem[disabledKey]);
        if (parentsHasDisabled) {
          return;
        }
      }
      delete checkedOptions.value[value];
    } else {
      // 找到节点的所有子孙节点
      let optionChildrens = findChildrenByNodeValue2(cascaderId, value, valueKey, childrenKey, flatternOptions.value);
      console.log('addMultipleOptionsChecked optionChildrens', optionChildrens);
      // 没有子孙节点的节点
      let optionPureChildrens: CascaderOptionItem[] = [];
      // 有子孙节点的节点
      let optionChildrensWhichHasChildren: CascaderOptionItem[] = [];
      optionChildrens.forEach(function (option: any) {
        let children = option[childrenKey];
        if (isArray(children) && children.length > 0) {
          optionChildrensWhichHasChildren.push(option);
        } else {
          optionPureChildrens.push(option);
        }
      });

      // 从选中的节点列表中移除
      optionPureChildrens.forEach(function (optionPureItem: any) {
        if (optionPureItem[disabledKey]) { // 禁用项不运行移除
          return;
        }
        let value = optionPureItem[valueKey];
        let parents = findOptionParents(value, valueKey);
        if (!allowDisabledAdd) {
          let parentsHasDisabled = parents.some((parentItem: any) => parentItem[disabledKey]);
          if (parentsHasDisabled) {
            return;
          }
        }
        delete checkedOptions.value[value];
      });

      optionParents = [...optionParents, optionItem, ...optionChildrensWhichHasChildren];
    }

    // 设置父级节点选中/半选中状态
    setParentsCheckedStatus(optionParents);
    let timer = setTimeout(function () {
      clearTimeout(timer);
      dropdownTransitionRef.value?.refresh();
    }, 60);
  };

  /**
   * 获取节点的选中状态
   * @param options
   */
  let getOptionsCheckedStatus = function (options: CascaderOptionItem[]) {
    let {
      value: valueKey,
      // disabled: disabledKey,
      children: childrenKey
    } = fieldNameProps.value;
    let allChecked = true;
    let hasAnyChecked = false;
    let hasHalfChecked = false;
    if (!Array.isArray(options)) {
      options = [options];
    }
    let checkedOptionsList = checkedOptions.value;
    let halfCheckedOptionsList = halfCheckedOptions.value;
    // console.log('halfCheckedOptionsList', halfCheckedOptionsList);
    options.forEach(function (optionItem: any) {
      let value = optionItem[valueKey];
      let children = optionItem[childrenKey];
      // console.log('hasHalfChecked', value, value in halfCheckedOptionsList);
      if (isArray(children) && children.length > 0) {
        // console.log('有子节点', value);
        if (value in halfCheckedOptionsList) { // 如果节点有子节点，则判断该节点是否为半选中状态
          console.log(33333);
          allChecked = false;
          hasHalfChecked = true;
          hasAnyChecked = true;
        } else { // 如果该节点不是半选中状态，则查找它下面的没有子节点的子孙节点的选中情况
          // 找到节点的所有子孙节点
          let optionItemChildrens = findChildrenByNodeValue2(cascaderId, value, valueKey, childrenKey, flatternOptions.value);
          let pureChildrenLength = 0;
          let pureChildrenCheckedCount = 0;
          optionItemChildrens.forEach(function (childrenItem: any) {
            let children = childrenItem[childrenKey];
            // 如果节点有子节点则跳过，因为在父子强关联的模式下只有叶子节点才能被选择
            if (isArray(children) && children.length > 0) {
              return;
            }
            let childrenItemValue = childrenItem[valueKey];
            pureChildrenLength++;
            if (childrenItemValue in checkedOptionsList) {
              pureChildrenCheckedCount++;
              hasAnyChecked = true;
            }
          });
          console.log('pureChildrenLength', pureChildrenLength, pureChildrenCheckedCount);
          if (pureChildrenLength == pureChildrenCheckedCount) {
            allChecked = true;
          } else {
            hasHalfChecked = true;
          }
        }
      } else {
        if (!(value in checkedOptionsList)) {
          allChecked = false;
        } else {
          hasAnyChecked = true;
        }
      }
    });
    console.log('hasHalfChecked最终的值', hasHalfChecked);
    return {
      allChecked,
      hasHalfChecked,
      hasAnyChecked
    };
  };

  // 设置父级节点选中/半选中状态
  let setParentsCheckedStatus = function (optionParents: CascaderOptionItem[]) {
    // let processedOption = {};
    console.log('设置父级节点选中/半选中状态', [...optionParents].reverse());
    let {
      value: valueKey,
      children: childrenKey
    } = fieldNameProps.value;
    // let checkedOptionsList = checkedOptions.value;
    let halfCheckedOptionsList = halfCheckedOptions.value;
    [...optionParents].reverse().forEach((parentItem: any) => {
      let parentItemValue = parentItem[valueKey];
      let { allChecked, hasHalfChecked, hasAnyChecked } = getOptionsCheckedStatus(parentItem[childrenKey]);
      console.log('子节点选中状态', parentItem, { allChecked, hasHalfChecked, hasAnyChecked });
      if (hasAnyChecked) {
        // console.log('设置父节点状态111');
        if (allChecked && !hasHalfChecked) {
          // console.log('设置父节点状态222');
          delete halfCheckedOptionsList[parentItemValue];
        } else {
          // console.log('设置父节点状态333');
          halfCheckedOptionsList[parentItemValue] = 1;
        }
      } else {
        delete halfCheckedOptionsList[parentItemValue];
        // console.log('设置父节点状态444');
      }
    });
  };

  return {
    addMultipleOptionsChecked,
    removeMultipleOptionsChecked
  };
};