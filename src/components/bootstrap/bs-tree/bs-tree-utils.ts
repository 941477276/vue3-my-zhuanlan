/**
 * 将树形结构扁平化转成普通对象
 * @param treeData 树数据
 * @param childrenKey 节点的子节点属性名
 * @param nodeLevel 节点的层级
 * @package parentNodeLevelPath 父级节点层级路径
 * @param target 目标对象
 */
export function flatTreeDataToObject (treeData: any[], childrenKey: string, nodeLevel = 1, parentNodeLevelPath = '', target: any = {}) {
  if (!Array.isArray(treeData)) {
    treeData = [treeData];
  }
  treeData.forEach((treeNode: any, index: number) => {
    if (!treeNode || typeof treeNode !== 'object') {
      return;
    }
    let nodeLeavePath = parentNodeLevelPath ? (parentNodeLevelPath + '_' + (index + 1)) : '' + (index + 1);
    target[nodeLeavePath] = treeNode;

    let children = treeNode[childrenKey];
    if (target.length) {
      target.length++;
    } else {
      target.length = 1;
    }
    // console.log('children', children, childrenKey);
    if (children && (children?.length || 0) > 0) {
      flatTreeDataToObject(children, childrenKey, nodeLevel + 1, nodeLeavePath, target);
    }
  });
  return target;
};

/**
 * 将树形结构扁平化转成普通对象
 * @param treeData 树数据
 * @param childrenKey 节点的子节点属性名
 * @param nodeLevel 节点的层级
 * @package parentNodeLevelPath 父级节点层级路径
 * @param target 目标对象
 */
export function flatTreeDataToObject2 (treeData: any[], childrenKey: string, nodeLevel = 1, parentNodeLevelPath = '', target: any = []) {
  if (!Array.isArray(treeData)) {
    treeData = [treeData];
  }
  treeData.forEach((treeNode: any, index: number) => {
    if (!treeNode || typeof treeNode !== 'object') {
      return;
    }
    let nodeLevelPath = parentNodeLevelPath ? (parentNodeLevelPath + '_' + (index + 1)) : '' + (index + 1);
    target.push({
      nodeLevelPath,
      node: treeNode
    });

    let children = treeNode[childrenKey];
    // console.log('children', children, childrenKey);
    if (children && (children?.length || 0) > 0) {
      flatTreeDataToObject2(children, childrenKey, nodeLevel + 1, nodeLevelPath, target);
    }
  });
  return target;
};

/**
 * 根据节点的层级路径查找它的所有父级节点
 * @param nodeLevelPath 节点层级路径
 * @param treeDataMap 扁平化的树对象
 */
export function findParentsByNodeLevelPath (nodeLevelPath: string, treeDataMap: any) {
  let nodeParents: any[] = [];
  if (!nodeLevelPath) {
    return nodeParents;
  }
  while (nodeLevelPath.length > 0) {
    // 从末尾开始查找“_”下划线的位置
    let lastUnderscoreIndex = nodeLevelPath.lastIndexOf('_');
    if (lastUnderscoreIndex <= 0) {
      return nodeParents;
    }
    nodeLevelPath = nodeLevelPath.substring(0, lastUnderscoreIndex);
    if (nodeLevelPath.length == 0) {
      return nodeParents;
    }
    let node = treeDataMap[nodeLevelPath];
    if (node) {
      nodeParents.push(node);
    }
  }
  return nodeParents;
};

/**
 * 根据节点的层级路径查找它的所有父级节点
 * @param nodeLevelPath 节点层级路径
 * @param treeDataArr 扁平化的树数组对象
 */
export function findParentsByNodeLevelPath2 (nodeLevelPath: string, treeDataArr: any[]) {
  let nodeParents: any[] = [];
  if (!nodeLevelPath) {
    return nodeParents;
  }
  // 从末尾开始查找“_”下划线的位置
  let lastUnderscoreIndex = nodeLevelPath.lastIndexOf('_');
  if (lastUnderscoreIndex <= 0) {
    return nodeParents;
  }
  nodeLevelPath = nodeLevelPath.substring(0, lastUnderscoreIndex);
  let recentedParentIndex = treeDataArr.findIndex(nodeInfoItem => nodeInfoItem.nodeLevelPath === nodeLevelPath);
  if (recentedParentIndex == -1) {
    return nodeParents;
  }
  nodeParents.push(treeDataArr[recentedParentIndex].node);

  while (nodeLevelPath.length > 0) {
    // 从末尾开始查找“_”下划线的位置
    let lastUnderscoreIndex = nodeLevelPath.lastIndexOf('_');
    if (lastUnderscoreIndex <= 0) {
      return nodeParents;
    }
    nodeLevelPath = nodeLevelPath.substring(0, lastUnderscoreIndex);
    if (nodeLevelPath.length == 0) {
      return nodeParents;
    }
    let searchResultFlag = false;
    // 从已查找到的父元素最近的位置开始往前查找
    for (let i = recentedParentIndex; i >= 0; i--) {
      let item = treeDataArr[i];
      console.log('往前查找父级！');
      if (item.nodeLevelPath === nodeLevelPath) {
        nodeParents.push(item.node);
        recentedParentIndex = i;
        searchResultFlag = true;
        break;
      }
    }
    console.log('往前查找完毕！！！');
    // 如果往前查找未查找到，则从已查找到的父元素最近的位置开始往后查找
    if (!searchResultFlag) {
      for (let i = recentedParentIndex, len = treeDataArr.length; i < len; i++) {
        let item = treeDataArr[i];
        console.log('往后查找父级！');
        if (item.nodeLevelPath === nodeLevelPath) {
          nodeParents.push(item.node);
          recentedParentIndex = i;
          searchResultFlag = true;
          break;
        }
      }
    }
  }
  return nodeParents;
};

/**
 * 根据节点的值查找节点
 * @param nodeValue 节点的值
 * @param nodeKey 节点的值的属性名
 * @param treeDataMap 扁平化的树对象
 */
export function findNodeByValue (nodeValue: any, nodeKey: string, treeDataMap: any) {
  let resultNode = {
    node: null,
    nodeLevelPath: ''
  };
  for (let attr in treeDataMap) {
    let nodeItem = treeDataMap[attr];
    if (nodeValue === nodeItem[nodeKey]) {
      resultNode.node = nodeItem;
      resultNode.nodeLevelPath = attr;
      break;
    }
  }
  return resultNode;
};

/**
 * 根据节点的值查找节点
 * @param nodeValue 节点的值
 * @param nodeKey 节点的值的属性名
 * @param treeDataArr 扁平化的树数组
 */
export function findNodeByValue2 (nodeValue: any, nodeKey: string, treeDataArr: any[]) {
  let resultNode = {
    node: null,
    nodeLevelPath: ''
  };
  for (let i = 0, len = treeDataArr.length; i < len; i++) {
    let nodeInfoItem = treeDataArr[i];
    // console.log('nodeInfoItem', nodeInfoItem.node[nodeKey]);
    if (nodeInfoItem.node[nodeKey] === nodeValue) {
      resultNode.node = nodeInfoItem.node;
      resultNode.nodeLevelPath = nodeInfoItem.nodeLevelPath;
      break;
    }
  }
  return resultNode;
};

/**
 * 根据节点的值查找节点的所有子节点
 * @param nodeValue 节点的值
 * @param nodeKey节点的值的属性名
 * @param treeDataArr 扁平化的树数组
 */
export function findChildrenByNodeValue2 (nodeValue: any, nodeKey: string, treeDataArr: any[]) {
  let nodeInfo = findNodeByValue2(nodeValue, nodeKey, treeDataArr);
  let result: any[] = [];
  if (!nodeInfo.node) {
    return result;
  }
  let findChildren = function (node: any) {
    let children = node.children;
    if (children && children.length > 0) {
      ([]).push.apply(result, children);
      children.forEach((nodeItem: any) => {
        findChildren(nodeItem);
      });
    }
  };
  findChildren(nodeInfo.node);
  return result;
}

/**
 * 根据节点的值查找节点的有children的子节点
 * @param nodeValue 节点的值
 * @param nodeKey节点的值的属性名
 * @param treeDataArr 扁平化的树数组
 */
export function findChildrenWhichHasChildren2 (nodeValue: any, nodeKey: string, treeDataArr: any[]) {
  let nodeInfo = findNodeByValue2(nodeValue, nodeKey, treeDataArr);
  let result: any[] = [];
  console.log('nodeInfo11', nodeInfo, nodeValue);
  if (!nodeInfo.node) {
    return result;
  }
  let findChildren = function (children: any[]) {
    // let children = node.children;
    // console.log('children111', children);
    if (children && children.length > 0) {
      // ([]).push.apply(result, children);
      // result.push()
      children.forEach((nodeItem: any) => {
        if (nodeItem.children && nodeItem.children.length > 0) {
          result.push(nodeItem);
          findChildren(nodeItem.children);
        }
      });
    }
  };
  findChildren((nodeInfo.node as any).children);
  return result;
}
