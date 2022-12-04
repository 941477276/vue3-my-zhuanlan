import { PropType, VNode } from 'vue';
import {
  MessageType,
  supportMessageTypes
} from './token';

export const messageProps = {
  type: { // 类型
    type: String as PropType<MessageType>,
    default: 'info',
    validator (typeVal: MessageType) {
      return supportMessageTypes.includes(typeVal);
    }
  },
  id: {
    type: String,
    default: null
  },
  message: { // 消息文字，可以为一个字符串、vnode、返回vnode的函数
    type: [String, Object, Function] as PropType<string|VNode|(() => VNode)>,
    default: ''
  },
  icon: { // 图标，可以为一个字符串、vnode、返回vnode的函数
    type: [String, Object, Function] as PropType<string|VNode|(() => VNode)>,
    default: ''
  },
  dangerouslyUseHTMLString: { // 是否将 message 属性作为 HTML 片段处理
    type: Boolean,
    default: false
  },
  customClass: { // 自定义类名
    type: String,
    default: ''
  },
  duration: { // 显示时间，单位为毫秒。 设为 0 则不会自动关闭
    type: Number,
    default: 3000
  },
  showClose: { // 是否显示关闭按钮
    type: Boolean,
    default: true
  },
  showIcon: { // 是否显示图标
    type: Boolean,
    default: true
  },
  onClose: { // 关闭时的回调函数, 参数为被关闭的 message 实例
    type: Function,
    default: null
  },
  zIndex: {
    type: [Number, String],
    default: ''
  },
  offsetTop: { // Message 距离窗口顶部的偏移量
    type: Number,
    default: 20
  },
  appendTo: { // 设置组件的根元素，默认为document.body
    type: [String, HTMLElement],
    default: ''
  },
  grouping: { // 合并内容相同的消息，不支持 VNode 类型的消息
    type: Boolean,
    default: false
  },
  repeatNum: { // 内容相同的消息数量
    type: Number,
    default: 1
  }
};
