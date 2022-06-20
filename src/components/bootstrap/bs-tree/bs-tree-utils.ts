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
    let nodeLeavePath = parentNodeLevelPath + '_' + (index + 1);
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
 * 根据节点的层级路径查找它的所有父级节点
 * @param nodeLevelPath 节点层级路径
 * @param treeDataMap 扁平化的树对象
 */
export function findNodeParentsByNodeLevelPath (nodeLevelPath: string, treeDataMap: any) {
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
