export const bsTreeProps = {
  nodeKey: { // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
    type: String,
    default: ''
  },
  showCheckbox: { // 节点是否可以多选
    type: Boolean,
    default: false
  },
  checkboxName: { // 复选框的name
    type: String,
    default: null
  },
  checkStrictly: { // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    type: Boolean,
    default: false
  },
  showRadio: { // 节点是否可以单选
    type: Boolean,
    default: false
  },
  radioName: { // 单选框框的name
    type: String,
    default: '--'
  },
  renderAfterExpand: { // 是否在第一次展开某个树节点后才渲染其子节点
    type: Boolean,
    default: true
  },
  renderContent: { // 树节点的内容区的渲染函数
    type: Function,
    default: null
  },
  highlightCurrent: { // 是否高亮当前选中节点
    type: Boolean,
    default: false
  },
  defaultExpandAll: { // 默认是否展开所有节点
    type: Boolean,
    default: false
  },
  expandOnClickNode: { // 点击节点的时候展开或者收缩节点
    type: Boolean,
    default: true
  },
  expandedKeys: { // 展开的节点的 key 的数组
    type: Array,
    default () {
      return [];
    }
  },
  autoExpandParent: { // 展开子节点的时候是否自动展开父节点
    type: Boolean,
    default: true
  },
  checkedKeys: { // 选中的节点的key数组（受控）
    type: Array,
    default () {
      return [];
    }
  },
  filterNodeMethod: { // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    type: Function,
    default: null
  },
  accordion: { // 是否每次只展开一个同级树节点
    type: Boolean,
    default: false
  },
  lazy: { // 是否懒加载子节点，需与 loadData 方法结合使用
    type: Boolean,
    default: false
  },
  loadData: { // 异步加载节点数据函数
    type: Function,
    default: null
  },
  pageSize: { // 子节点分页显示数量，值为0表示不使用分页
    type: Number,
    default: 2
  },
  loadMoreChildButtonText: {
    type: String,
    default: '...显示更多'
  },
  loadAllChildButtonText: {
    type: String,
    default: '显示全部'
  }
};
