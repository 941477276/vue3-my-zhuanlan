export const bsLoadingProps = {
  visible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  grow: { // 是否为增长式旋转器
    type: Boolean,
    default: false
  },
  vertical: { // 是否垂直对齐
    type: Boolean,
    default: false
  },
  color: { // 字体颜色
    type: String,
    default: ''
  },
  background: { // 背景色
    type: String,
    default: ''
  },
  transitionName: { // 过渡效果名称
    type: String,
    default: 'fade'
  },
  fullscreen: { // 是否全屏
    type: Boolean,
    default: false
  },
  customClass: { // 自定义class类名
    type: String,
    default: ''
  },
  style: { // dom style
    type: Object,
    default () {
      return {};
    }
  }
};
