import { PropType } from 'vue';
export const bsTableCellProps = {
  rowData: {
    type: Object,
    default () {
      return {};
    }
  },
  rowIndex: {
    type: Number
  },
  tableSlots: {
    type: Object
  },
  rowId: { // 行id
    type: String
  },
  isTreeData: { // 是否为树状数据
    type: Boolean
  },
  hasChildren: { // 是否有子节点
    type: Boolean
  },
  treeLevel: { // 树状结构数据的层级
    type: Number
  },
  treeRowExpand: { //  树状数据时，行是否展开了
    type: Boolean
  }
};
