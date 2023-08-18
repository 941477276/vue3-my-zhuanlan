import { PropType, VNode, InjectionKey, Ref } from 'vue';
import type { BsNodeInfo } from '../bs-tree/bs-tree-types';

// 表格列属性
export interface BsTableColumn {
  label: string|number|((index: number, column: BsTableColumn) => string|number|VNode); // 列名
  prop: string; // 列数据字段名称
  headSlotName?: string; // 头部单元格插槽名称
  colSpan?: number|((index: number, column: BsTableColumn) => number); // 头部单元格合并数量
  width?: string|number;
  minWidth?: string|number;
  fixed?: boolean|'left'|'right'; // 列是否固定住
  customHeadCellAttrs?: (index: number, column: BsTableColumn) => Record<any, any>; // 自定义头部单元格属性
  customCell?: (data: Record<string, any>, cellIndex: number, rowIndex: number) => Record<any, any>; // 自定义数据单元格内容
  customCellAttrs?: (data: Record<string, any>, cellIndex: number, rowIndex: number, column: BsTableColumn) => Record<any, any>; // 自定义数据单元格属性及样式
  // cellClassName?: string|string[]|((data: Record<string, any>, cellIndex: number, rowIndex: number, column: BsTableColumn) => (string|string[])); // 自定义数据单元格class
  ellipsis?: boolean; // 文本溢出后是否显示3个点
  showTooltip?: boolean|object; // 文本溢出后是否显示tooltip
  resizeable?: boolean; // 列宽是否可以拖拽
};

export interface BsTableColumnInner extends BsTableColumn {
  fixedIndex?: number;
  fixedLeftColumnCount?: number; // 左侧固定列数量
  fixedRightColumnCount?: number;
}

// 单元格需要行合并的信息
export interface BsTableRowSpanCellInfo {
  cellIndex: number; // 单元格索引
  rowIndex: number; // 行索引
  rowSpan: number; // 合并行的数量
  colSpan?: number; // 合并列的数量
};

export type BsTableSize = 'sm' | '';

export interface BsColgroupItem {
  width: number;
  minWidth: number;
  name: string;
};

// 选框类型
export type BsTableSelectionType = 'checkbox' | 'radio';

export interface BsTableSelectionChangeResult {
  row: Record<string, any>|null;
  isSelected: boolean;
  isHalfSelected: boolean;
  operateType: 'selectSingle' | 'selectAll' | 'selectNone'; // 操作类型
  selectedRowKeys: string[];
  selectedRows: Record<string, any>[];
  halfSelectedRowKeys: string[]
  halfSelectedRows: Record<string, any>[];
};

// 行选择功能的配置项
export interface BsTableSelectionConfig {
  type: 'checkbox'|'radio'; // 选择框的类型
  columnWidth?: string|number; // 选择列的宽度
  columnTitle?: string|VNode|(() => VNode); // 选择列的标题
  checkboxName?: string; // 复选框的name
  checkStrictly?: boolean; // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
  radioName?: string; // 单选框框的name
  // selectedRowKeys?: string[]; //  选中行的key
  reserveSelectedRowKeys?: boolean; // 当数据更新后是否仍然保留之前选中行的key
  rowDisabled?: (row: Record<string, any>, rowIndex: number) => boolean|void; // 行禁用函数
  // onChange?: (selectedRowKeys: string[], selectedRows: Record<string, any>[]) => void; // 选中项发生变化时的回调
  onSelectChange?: (selection: BsTableSelectionChangeResult) => void; // 用户手动选择/取消选择某列的回调
}

export const bsTableProps = {
  columns: { // 表格列
    type: Array as PropType<BsTableColumn[]>,
    default () {
      return [];
    }
  },
  data: { // 表格数据
    type: Array as PropType<Record<string, any>[]>,
    default () {
      return [];
    }
  },
  stripe: { // 是否为带斑马纹表格
    type: Boolean,
    default: false
  },
  border: { // 是否为带边框
    type: Boolean,
    default: false
  },
  borderless: { // 是否去掉边框
    type: Boolean,
    default: false
  },
  size: { // 表格大小
    type: String as PropType<BsTableSize>
  },
  rowKey: { // 行数据的 Key，用来优化 Table 的渲染，可以是字符串或一个函数，支持`user.info.id`形式，但不支持`user.info[0].id`，此种情况请使用`Function`
    type: [String, Function],
    required: true
  },
  rowClassName: { // 自定义数据行class
    type: [String, Array, Object, Function]
  },
  // 表格高度
  height: [String, Number],
  // 表格最大高度
  maxHeight: [String, Number],
  allowExpand: { // 是否允许展开
    type: Boolean
  },
  expandColumnWidth: { // 展开列的宽度
    type: [String, Number],
    default: 50
  },
  expandColumnLabel: { // 展开列的列名称
    type: [String, Number, Function],
    default: ''
  },
  childrenKey: { // 树形数据结构中下级节点在数据中的 key
    type: String,
    default: 'children'
  },
  isLeafKey: { // 懒加载模式下，树形数据结构中没有子下级节点的key，当值为true表示该行没有下级节点了
    type: String,
    default: 'isLeaf'
  },
  defaultExpandAllRows: { // 默认是否展开所有行
    type: Boolean
  },
  defaultExpandedRowKeys: { // 默认展开的行
    type: Array as PropType<string[]>,
    default () {
      return [];
    }
  },
  lazy: { // 是否懒加载树状数据
    type: Boolean
  },
  load: { // 加载数据函数
    type: Function
  },
  selectionConfig: { // 选择项配置
    type: Object as PropType<BsTableSelectionConfig>,
    default () {
      return {};
    }
  },
  selectedRowKeys: { //  选中行的key
    type: Array as PropType<string[]>,
    default () {
      return [];
    }
  },
  reserveExpandedRowKeys: { // 当数据更新后是否仍然之前展开行的key
    type: Boolean
  }
};

export interface BsTableRealRow {
  treeDataRowExpand: boolean; // 树状数据时，当前行是否展开了
  treeLevel: number; // 树的层级
  uid: string;
  rowData: Record<string, any>;
  children: BsTableRealRow[]
}

export interface BsTableRowData extends BsNodeInfo {
  treeDataRowExpand: boolean; // 树状数据时，当前行是否展开了
  // treeLevel: number; // 树的层级
  uid: string;
  visible: boolean; // 当前行是否显示
  // rowData: Record<string, any>;
  // children: BsTableRealRow[]
}

export interface BsTableContext {
  tableWidth: Ref<number>;
  rowSpanCells: Record<string, BsTableRowSpanCellInfo>;
  checkedKeysRoot: Ref<Set<string>>;
  halfCheckedKeys: Ref<Set<string>>;
  addRowSpanCell: (rowSpanCellInfo: BsTableRowSpanCellInfo) => void;
  removeRowSpanCell: (rowSpanCellInfo: BsTableRowSpanCellInfo, removeCurrentRowCells?: boolean) => void;
  expandTreeRow: (rowData: any, rowId: string, expandChildRow?: boolean, callback?: (flag?: boolean) => void) => void;
  addResizeEvent: (callback: () => void) => void;
  removeResizeEvent: (callback: () => void) => void;
  setColWidth: (colIndex: number, width: number) => void;
  setRowSelectionDisabled: (rowId: string, disabled: boolean) => void;
  addCheckedKey: (rowId: string, nodeData: Record<string, any>, hasChildren: boolean) => void;
  removeCheckedKey: (rowId: string, nodeData: Record<string, any>, hasChildren: boolean) => void;
  getSelectionInfo: () => any;
  selectAll: () => void;
  selectNone: () => void;
}
export const bsTableCtxKey: InjectionKey<BsTableContext> = Symbol('bsTableCtx');

export const bsSelectionColumnKey = 'bs_selection_column';
export const bsExpandColumnKey = 'bs_expand_column';
