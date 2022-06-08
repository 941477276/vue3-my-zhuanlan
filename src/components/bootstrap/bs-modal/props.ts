import {
  PropType
} from 'vue';
import { ModalSize } from '@/ts-tokens/bootstrap/modal';

export const bsModalProps = {
  id: {
    type: String,
    default: null
  },
  title: { // 标题
    type: [String, Function, Object],
    default: ''
  },
  width: { // 宽度
    type: String,
    default: ''
  },
  maxWidth: { // 最大宽度
    type: String,
    default: ''
  },
  size: { // 弹窗大小
    type: String as PropType<ModalSize>,
    default: ''
  },
  centered: { // 是否居中显示
    type: Boolean,
    default: false
  },
  mask: { // 是否显示遮罩
    type: Boolean,
    default: true
  },
  keyboard: { // 是否支持键盘 esc 关闭
    type: Boolean,
    default: true
  },
  maskClosable: { // 点击遮罩是否关闭
    type: Boolean,
    default: true
  },
  fullscreen: { // 是否全屏
    type: Boolean,
    default: false
  },
  lockScroll: { // 是否锁定滚动条
    type: Boolean,
    default: true
  },
  draggable: { // 是否可以拖拽移动
    type: Boolean,
    default: true
  },
  scrollable: { // 弹窗内容部分是否可滚动
    type: Boolean,
    default: false
  },
  showFooter: { // 是否显示底部
    type: Boolean,
    default: true
  }
};
