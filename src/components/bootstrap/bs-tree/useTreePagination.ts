import { computed, ref, Ref } from 'vue';
import { BsNodeData } from '@/ts-tokens/bootstrap/tree';

/**
 * 子节点分页处理
 * @param props props
 * @param treeData 树数据
 */
export function useTreePagination (props: any, treeData?: Ref<BsNodeData[]|undefined>) {
  // 当前页码
  let pageCount = ref(1);
  // 子节点
  let nodeChildren = computed(function () {
    let children = treeData ? treeData.value : (props.nodeData[props.childrenKey] || []);
    let pageSize = Math.ceil(props.pageSize);
    if (!isNaN(pageSize) && pageSize > 0 && children.length > pageSize) {
      return children.slice(0, pageCount.value * pageSize);
    }

    return children;
  });
  // 总页数
  let totalPage = computed(function () {
    let children = treeData ? treeData.value : (props.nodeData[props.childrenKey] || []);

    let pageSize = Math.ceil(props.pageSize);
    if (!isNaN(pageSize) && pageSize > 0 && children.length > pageSize) {
      return Math.ceil(children.length / pageSize);
    }
    return 0;
  });
  // 显示更多子节点
  let showMoreChildNode = function () {
    if (props.pageSize <= 0 && pageCount.value >= totalPage.value) {
      return;
    }
    pageCount.value++;
  };

  // 显示所有子节点
  let showAllChildNode = function () {
    if (props.pageSize <= 0) {
      return;
    }
    pageCount.value = totalPage.value;
  };

  return {
    pageCount,
    nodeChildren,
    totalPage,
    showMoreChildNode,
    showAllChildNode
  };
};
