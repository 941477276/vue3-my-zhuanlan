import {
  PropType,
  VNode
} from 'vue';
import {
  MessageType,
  supportMessageTypes
} from '@/ts-tokens/bootstrap/message';
import {
  BsColorType
} from '@/ts-tokens/bootstrap';

export const bsMessageBoxProps = {
  appContext: { // 上下文，一般用于获取全局注册组件、vuex 等内容
    default: null
  },
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
  title: { // 标题
    type: [String, Function] as PropType<string|(() => string)>,
    default: ''
  },
  message: { // 消息文字，可以为一个字符串、vnode、返回vnode的函数
    type: [String, Object, Function] as PropType<string|VNode|(() => VNode)>,
    default: ''
  },
  dialogTheme: { // 是否显示为弹窗样式
    type: Boolean,
    default: false
  },
  maxWidth: { // 最大宽度
    type: String,
    default: ''
  },
  icon: { // 图标，可以为一个字符串、vnode、返回vnode的函数
    type: [String, Object, Function] as PropType<string|VNode|(() => VNode)>,
    default: 'info'
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
    default: false
  },
  showOnButton: { // 是否显示确定按钮
    type: Boolean,
    default: true
  },
  showCancelButton: { // 是否显示取消按钮
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
  mask: { // 是否显示遮罩
    type: Boolean,
    default: true
  },
  keyboard: { // 是否支持键盘 esc 关闭
    type: Boolean,
    default: true
  },
  closeOnClickModal: { // 点击遮罩是否关闭
    type: Boolean,
    default: true
  },
  okLoading: { // 确定按钮的loading属性
    type: Boolean,
    default: false
  },
  okDisabled: { // 确定按钮的disabled属性
    type: Boolean,
    default: false
  },
  okType: {
    type: String as PropType<BsColorType>,
    default: 'primary'
  },
  okText: { // 确定按钮的文本
    type: String,
    default: '确定'
  }
};
