export const bsTooltipProps = {
  showArrow: { // 是否显示三角箭头
    type: Boolean,
    default: true
  },
  arrowClass: { // 三角箭头的class
    type: String,
    default: ''
  },
  virtualTriggering: { // 是否由虚拟元素触发
    type: Boolean,
    default: false
  },
  virtualRef: { // 触发元素的ref
    type: [String, Function, Object],
    default: null
  },
  showDelay: { // 延迟出现，单位毫秒
    type: Number,
    default: 100
  },
  hideDelay: { // 延迟关闭，单位毫秒
    type: Number,
    default: 200
  }
};
