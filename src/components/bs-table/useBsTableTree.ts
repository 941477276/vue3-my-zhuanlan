import { computed, ref, Ref } from 'vue';
import {
  findNodeByUid,
  findParentsByUid,
  findChildrenWhichHasChildrenByUid,
  findChildrenNodesByUid
} from '../bs-tree/bs-tree-utils';
import { BsNodeData } from '../bs-tree/bs-tree-types';
import { BsTableRowData } from './bs-table-types';
import { getPropValueByPath, isFunction } from '../../utils/bs-util';

export function useBsTableTree (props: any, flattenTreeDatas: Ref<BsTableRowData[]>, treeId: string, childrenKey: Ref<string>, tableId: string, getRowDataHash: (rowData: Record<string, any>) => string) {
  // 选中行的key
  let checkedKeysRoot: Ref<Set<string>> = ref(new Set());
  // 当前数据中选中的行
  let checkedRowsCurrent: Ref<Map<string, any>> = ref(new Map());
  // 所有选中的行
  let checkedRows: Ref<Map<string, any>> = ref(new Map());
  // 半选中行的key
  let halfCheckedKeys: Ref<Set<string>> = ref(new Set());

  let addCheckedKey = function (uid: string, isDisabled?: boolean) {
    let nodeInfo = findNodeByUid(treeId, uid, flattenTreeDatas.value);
    if (isDisabled || !nodeInfo || nodeInfo.isDisabled) {
      // 如果被禁用的节点没有子节点，则不添加进去
      if (!nodeInfo || !nodeInfo.node[childrenKey.value]) {
        return false;
      }
    }
    // console.log('添加进选中项：', uid, nodeInfo.node);
    checkedRowsCurrent.value.set(uid, nodeInfo.node);
    checkedRows.value.set(uid, nodeInfo.node);
    checkedKeysRoot.value.add(uid);
    /* if (!checkedKeysRoot.value.has(uid)) {
      checkedKeysRoot.value.add(uid);
    } */
    return true;
  };
  let removeCheckedKey = function (uid: string, isDisabled?: boolean) {
    let nodeInfo = findNodeByUid(treeId, uid, flattenTreeDatas.value);
    checkedRowsCurrent.value.delete(uid);
    checkedRows.value.delete(uid);
    // console.log('移除选中项：', uid, nodeInfo.node);
    if (isDisabled || !nodeInfo || nodeInfo.isDisabled) {
      // 如果被禁用的节点没有子节点，则不移除
      if (!nodeInfo || !nodeInfo.node[childrenKey.value]) {
        // 节点为禁用的且没有子节点
        return false;
      }
    }
    /* let index = checkedKeysRoot.value.findIndex(item => item === nodeKey);
    if (index > -1) {
      checkedKeysRoot.value.splice(index, 1);
    } */
    checkedKeysRoot.value.delete(uid);
    return true;
  };
  let addHalfCheckedKey = function (uid: string) {
    if (!halfCheckedKeys.value.has(uid)) {
      halfCheckedKeys.value.add(uid);
    }
  };
  let removeHalfCheckedKey = function (uid: string) {
    /* let index = halfCheckedKeys.value.findIndex(item => item === nodeKey);
    if (index > -1) {
      halfCheckedKeys.value.splice(index, 1);
    } */
    halfCheckedKeys.value.delete(uid);
  };

  // 判断节点是否全部选中
  let nodesIsAllChecked = function (nodes: BsNodeData | BsNodeData[], callback?: (node: BsNodeData, uid: any) => void) {
    let allChecked = true;
    let hasChecked = false;
    let hasHalfChecked = false;
    // let nodeKey = props.nodeKey;
    let checkedKeys = checkedKeysRoot.value;
    let halfCheckedKeysVal = halfCheckedKeys.value;
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach((nodeItem: BsNodeData) => {
      let nodeValue = nodeItem.uid;
      if (typeof callback === 'function') {
        callback(nodeItem, nodeValue);
      }
      let isChecked = checkedKeys.has(nodeValue);
      if (halfCheckedKeysVal.has(nodeValue)) {
        hasHalfChecked = true;
      }
      if (!isChecked || hasHalfChecked) {
        allChecked = false;
      }
      if (isChecked) {
        hasChecked = true;
      }
    });
    return {
      allChecked,
      hasChecked,
      hasHalfChecked
    };
  };

  // 移除父级节点的选中状态
  let removeParentsChecked = function (nodeValue: string|number) {
    let flattenTreeDatasRaw = flattenTreeDatas.value;
    let parents = findParentsByUid<BsTableRowData>(treeId, nodeValue, flattenTreeDatasRaw);
    parents.forEach(function (parentNodeInfo) {
      let parentNodeValue = parentNodeInfo.uid;
      let childrenCheckedInfo = nodesIsAllChecked(findChildrenNodesByUid(treeId, parentNodeValue, flattenTreeDatasRaw));
      if (childrenCheckedInfo.allChecked) {
        return;
      }
      if (childrenCheckedInfo.hasChecked || childrenCheckedInfo.hasHalfChecked) {
        removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
        addHalfCheckedKey(parentNodeValue);
      } else {
        removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
        removeHalfCheckedKey(parentNodeValue);
      }
    });
  };

  // 添加父级节点的选中状态
  let addParentsChecked = function (nodeValue: string|number) {
    let flattenTreeDatasRaw = flattenTreeDatas.value;
    let parents = findParentsByUid<BsTableRowData>(treeId, nodeValue, flattenTreeDatasRaw);
    parents.forEach(function (parentNodeInfo) {
      let parentNodeValue = parentNodeInfo.uid;
      let childrenCheckedInfo = nodesIsAllChecked(findChildrenNodesByUid(treeId, parentNodeValue, flattenTreeDatasRaw));

      if (childrenCheckedInfo.allChecked) {
        addCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
        removeHalfCheckedKey(parentNodeValue);
      } else if (childrenCheckedInfo.hasHalfChecked || childrenCheckedInfo.hasChecked) {
        removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
        addHalfCheckedKey(parentNodeValue);
      } else {
        removeCheckedKey(parentNodeValue, parentNodeInfo.isDisabled);
        removeHalfCheckedKey(parentNodeValue);
      }
    });
  };

  // 移除自己及子孙节点选中状态
  let removeSelfAndChildrenChecked = function (nodeValue: string|number) {
    let childrenKeyRaw = childrenKey.value;
    let flattenTreeDatasRaw = flattenTreeDatas.value;
    let nodeInfo = findNodeByUid(treeId, nodeValue, flattenTreeDatasRaw);
    if (!nodeInfo) {
      return;
    }
    // 根据节点的值查找有children的子节点
    let hasChildrenChildNodes = findChildrenWhichHasChildrenByUid<BsTableRowData>(treeId, nodeValue, childrenKeyRaw, flattenTreeDatasRaw);
    hasChildrenChildNodes.unshift(nodeInfo);
    // 将有子节点的节点反转过来后再进行处理，这样就达到了从下往上处理的效果
    hasChildrenChildNodes.reverse().forEach((nodeDataItem) => {
      let nodeChildren = findChildrenNodesByUid(treeId, nodeDataItem.uid, flattenTreeDatasRaw);
      let nodeDataItemValue = nodeDataItem.uid;
      if (nodeChildren.length == 0) {
        removeCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        return;
      }
      nodeChildren.forEach((childNode) => {
        removeCheckedKey(childNode.uid, childNode.isDisabled);
      });
      let childrenCheckedInfo = nodesIsAllChecked(nodeChildren);
      if (childrenCheckedInfo.allChecked) {
        addCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        removeHalfCheckedKey(nodeDataItemValue);
        return;
      }
      if (!childrenCheckedInfo.hasChecked && !childrenCheckedInfo.hasHalfChecked) {
        removeCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        removeHalfCheckedKey(nodeDataItemValue);
      } else {
        removeCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        addHalfCheckedKey(nodeDataItemValue);
      }
    });
  };

  // 添加自己及子孙节点选中状态
  let addSelfAndChildrenChecked = function (nodeValue: string|number) {
    let childrenKeyRaw = childrenKey.value;

    let flattenTreeDatasRaw = flattenTreeDatas.value;
    let nodeInfo = findNodeByUid<BsTableRowData>(treeId, nodeValue, flattenTreeDatasRaw);
    if (!nodeInfo) {
      return;
    }
    // 根据节点的值查找有children的子节点
    let hasChildrenChildNodes = findChildrenWhichHasChildrenByUid<BsTableRowData>(treeId, nodeValue, childrenKeyRaw, flattenTreeDatasRaw);
    hasChildrenChildNodes.unshift(nodeInfo);
    // 将有子节点的节点反转过来后再进行处理，这样就达到了从下往上处理的效果
    hasChildrenChildNodes.reverse().forEach((nodeDataItem) => {
      // let children = nodeDataItem[childrenKeyRaw];
      let nodeChildren = findChildrenNodesByUid(treeId, nodeDataItem.uid, flattenTreeDatasRaw);
      let nodeDataItemValue = nodeDataItem.uid;
      if (nodeChildren.length == 0) {
        addCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        return;
      }
      nodeChildren.forEach((childNodeData) => {
        addCheckedKey(childNodeData.uid, childNodeData.isDisabled);
      });
      let childrenCheckedInfo = nodesIsAllChecked(nodeChildren);
      if (childrenCheckedInfo.allChecked) {
        addCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        removeHalfCheckedKey(nodeDataItemValue);
        return;
      }
      if (childrenCheckedInfo.hasChecked || childrenCheckedInfo.hasHalfChecked) {
        removeCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        addHalfCheckedKey(nodeDataItemValue);
      } else {
        removeCheckedKey(nodeDataItemValue, nodeDataItem.isDisabled);
        removeHalfCheckedKey(nodeDataItemValue);
      }
    });
  };

  // 获取选中行的信息
  let getSelectionInfo = function () {
    let flattenTableRowsRaw = flattenTreeDatas.value;

    let selectedRowKeys = Array.from(checkedKeysRoot.value);
    /* let selectedRows = selectedRowKeys.map(rowKey => {
      return findNodeByUid(tableId, rowKey, flattenTableRowsRaw)?.node;
    }).filter(row => !!row); */
    // console.log('所有选中项：', checkedRows.value.values());
    let selectedRows = [...checkedRows.value.values()];

    let halfSelectedRowKeys = Array.from(halfCheckedKeys.value);
    let halfSelectedRows = halfSelectedRowKeys.map(rowKey => {
      return findNodeByUid(tableId, rowKey, flattenTableRowsRaw)?.node;
    }).filter(row => !!row);

    return {
      selectedRowKeys,
      selectedRows,
      halfSelectedRowKeys,
      halfSelectedRows
    };
  };

  // 选择所有行
  let selectAll = function () {
    let { type, checkStrictly, onSelectChange } = props.selectionConfig;
    if (type != 'checkbox') {
      return;
    }
    flattenTreeDatas.value.forEach(rowInfo => {
      let { uid, isDisabled, nodeLevel } = rowInfo;
      if (checkStrictly) {
        addCheckedKey(uid);
      } else {
        if (nodeLevel == 1) { // 从最顶层开始选择
          addSelfAndChildrenChecked(uid);
        }
      }
    });
    let selectionInfo = getSelectionInfo();
    if (isFunction(onSelectChange)) {
      onSelectChange({
        row: null,
        isSelected: true,
        operateType: 'selectAll',
        isHalfSelected: false,
        ...selectionInfo
      });
    }
  };

  // 取消选择所有行
  let selectNone = function () {
    let { type, checkStrictly, onSelectChange } = props.selectionConfig;
    if (type != 'checkbox') {
      return;
    }
    flattenTreeDatas.value.forEach(rowInfo => {
      let { uid, isDisabled, nodeLevel } = rowInfo;
      if (checkStrictly) {
        removeCheckedKey(uid);
      } else {
        if (nodeLevel == 1) { // 从最顶层开始选择
          removeSelfAndChildrenChecked(uid);
        }
      }
    });
    let selectionInfo = getSelectionInfo();
    if (isFunction(onSelectChange)) {
      onSelectChange({
        row: null,
        isSelected: false,
        operateType: 'selectNone',
        isHalfSelected: false,
        ...selectionInfo
      });
    }
  };

  // 添加选中行
  let selectRow = function (rowKey: string, rowData?: Record<string, any>) {
    if (!checkedKeysRoot.value.has(rowKey)) {
      let { type, checkStrictly, onSelectChange } = props.selectionConfig;
      if (type == 'checkbox') {
        if (!checkStrictly) {
          // 添加自己及子孙节点的选中状态
          addSelfAndChildrenChecked(rowKey);
          // 添加父级节点的选中状态
          addParentsChecked(rowKey);
        } else {
          addCheckedKey(rowKey);
        }
      } else {
        checkedKeysRoot.value = new Set([rowKey]);
      }
      let selectionInfo = getSelectionInfo();
      if (isFunction(onSelectChange)) {
        if (!rowData) {
          rowData = findNodeByUid(tableId, rowKey, flattenTreeDatas.value)?.node;
        }
        onSelectChange({
          row: rowData,
          isSelected: true,
          operateType: 'selectSingle',
          isHalfSelected: halfCheckedKeys.value.has(rowKey),
          ...selectionInfo
        });
      }
    }
  };

  // 移除选中项
  let unSelectRow = function (rowKey: string, rowData?: Record<string, any>) {
    let { type, checkStrictly, onSelectChange } = props.selectionConfig;
    if (type == 'checkbox') {
      if (!checkStrictly) {
        // 移除自己及子孙节点的选中状态
        removeSelfAndChildrenChecked(rowKey);
        // 移除父级节点的选中状态
        removeParentsChecked(rowKey);
      } else {
        removeCheckedKey(rowKey);
      }
    } else {
      removeCheckedKey(rowKey);
    }
    let selectionInfo = getSelectionInfo();
    if (isFunction(onSelectChange)) {
      if (!rowData) {
        rowData = findNodeByUid(tableId, rowKey, flattenTreeDatas.value)?.node;
      }
      onSelectChange({
        row: rowData,
        isSelected: false,
        operateType: 'selectSingle',
        isHalfSelected: halfCheckedKeys.value.has(rowKey),
        ...selectionInfo
      });
    }
  };

  // 移除行的下级节点（给外部使用的）
  let removeRowChildren = function (rowData: Record<string, any>) {
    let uid = '';
    let rowKey = props.rowKey;
    if (isFunction(rowKey)) {
      uid = rowKey(rowData);
    } else {
      uid = getPropValueByPath(rowData, rowKey).value || getRowDataHash(rowData);
    }
    let flattenTableRowsRaw = flattenTreeDatas.value;
    let rowIndex = flattenTableRowsRaw.findIndex(rowItem => rowItem.uid == uid);

    if (rowIndex < 0) {
      return;
    }
    let row = flattenTableRowsRaw[rowIndex];
    let nodeLevelPath = row.nodeLevel;
    for (let i = flattenTableRowsRaw.length - 1; i > rowIndex; i--) {
      let rowItem = flattenTableRowsRaw[i];
      if (rowItem.nodeLevelPath.startsWith(nodeLevelPath + '_')) {
        flattenTableRowsRaw.splice(i, 1);
      }
    }
    delete row.node[props.childrenKey];
  };

  // 展开行的id
  let expandedTreeRowIds: Set<string> = new Set();
  /**
   * 展开树状行
   * @param rowData 行数据
   * @param rowId 行id
   * @param expandChildRow 是否展开子节点
   * @param forceExpand 是否强制展开行
   * @param callback 回调函数
   */
  let expandTreeRow = function (rowData: any, rowId: string, expandChildRow = true, forceExpand = false, callback?: (flag: boolean) => void) {
    let flattenTableRowsRaw = flattenTreeDatas.value;
    let row = findNodeByUid(tableId, rowId, flattenTableRowsRaw);
    if (!row) {
      return;
    }

    let childrenKey = props.childrenKey;
    let children = row.node[childrenKey] || [];
    if (children.length == 0) {
      return;
    }
    let childrenRows = findChildrenNodesByUid<BsTableRowData>(tableId, rowId, flattenTableRowsRaw);
    if (!row.treeDataRowExpand || forceExpand) { // 展开
      // console.log('展开行：', rowId, rowData, childrenRows);
      row.treeDataRowExpand = true;
      expandedTreeRowIds.add(row.uid);
      // 显示子节点
      childrenRows.forEach((childRow) => {
        childRow.visible = true;
      });
      // console.log('expandChildRow', expandChildRow);
      childrenRows.forEach(childRowItem => {
        let childRowId = childRowItem.uid;
        if (expandedTreeRowIds.has(childRowId)) { // 如果子节点之前是展开状态，那么此时应该再次展开它
          childRowItem.treeDataRowExpand = false;
          expandTreeRow(childRowItem.node, childRowId, expandChildRow, forceExpand, callback);
        } else if (expandChildRow) {
          expandTreeRow(childRowItem.node, childRowId, expandChildRow, forceExpand, callback);
        }
      });
    } else { // 收起
      row.treeDataRowExpand = false;
      expandedTreeRowIds.delete(row.uid);
      // console.log('收起行：', rowId, rowData);
      // 折叠子节点
      let foldChildren = function (rows: BsTableRowData[]) {
        rows.forEach(childRowItem => {
          childRowItem.visible = false;
          let children = findChildrenNodesByUid<BsTableRowData>(tableId, childRowItem.uid, flattenTableRowsRaw);
          if (children.length > 0) {
            foldChildren(children);
          }
        });
      };
      foldChildren(childrenRows);
    }
  };

  return {
    checkedKeysRoot,
    halfCheckedKeys,
    checkedRowsCurrent,
    expandedTreeRowIds,
    checkedRows,
    // treeNodeProps,

    addCheckedKey,
    removeCheckedKey,
    addHalfCheckedKey,
    removeHalfCheckedKey,
    addParentsChecked,
    removeParentsChecked,
    addSelfAndChildrenChecked,
    removeSelfAndChildrenChecked,
    nodesIsAllChecked,

    removeRowChildren,
    selectAll,
    selectNone,
    selectRow,
    unSelectRow,
    getSelectionInfo,
    expandTreeRow
  };
};
