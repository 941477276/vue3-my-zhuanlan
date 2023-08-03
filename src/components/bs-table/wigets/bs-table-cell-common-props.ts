import { PropType } from 'vue';
import { BsTableSelectionType } from '../bs-table-types';
export const bsTableCellCommonProps = {
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
  },
  lazy: { // 是否懒加载树状数据
    type: Boolean
  },
  isLeafKey: { // 懒加载模式下，树形数据结构中没有子下级节点的key，当值为true表示该行没有下级节点了
    type: String,
    default: 'isLeaf'
  },
  childrenKey: { // 树形数据结构中下级节点在数据中的 key
    type: String,
    default: 'children'
  },
  selection: { // 选择框的类型
    type: String as PropType<BsTableSelectionType>
  },
  checkboxName: { // 复选框的name
    type: String
  },
  checkStrictly: { // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    type: Boolean,
    default: false
  },
  radioName: { // 单选框框的name
    type: String
  }
};
