export const bsTreeNodeProps = {
  nodeLeave: { // 节点层级，从1开始
    type: Number,
    default: 1
  },
  nodeData: { // 节点数据
    type: Object,
    default () {
      return {};
    }
  },
  labelKey: { // 节点标题的属性名
    type: [String, Function],
    default: 'label'
  },
  childrenKey: { // 节点的子节点属性名
    type: String,
    default: 'children'
  },
  disabledKey: { // 节点是否禁用的属性名
    type: [String, Function],
    default: 'disabled'
  },
  isLeafKey: { // 节点是否为叶子节点属性名，仅在指定了 lazy 属性的情况下生效
    type: [String, Function],
    default: 'isLeaf'
  }
};
