import { PropType } from 'vue';
import { BsSize } from '@/ts-tokens/bootstrap';

export const bsSelectInputProps = {
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: { // 是否正在加载数据
    type: Boolean,
    default: false
  },
  loadingText: { // 正在加载数据时的提示文字
    type: String,
    default: '加载中...'
  },
  clearable: { // 是否可以清空内容
    type: Boolean,
    default: false
  },
  deliveContextToFormItem: { // 是否向form-item组件传递上下文信息
    type: Boolean,
    default: true
  },
  size: { // 输入框大小
    type: String as PropType<BsSize>,
    default: ''
  },
  id: {
    type: String,
    default: '',
    validator (idVal: string) {
      if (typeof idVal !== 'string' || /^\d+/.test(idVal)) {
        console.warn('id必须为字符串类型，且不能以数字开头');
        return false;
      }
      return true;
    }
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  name: { // input原生的name属性
    type: String,
    default: null
  },
  ariaLabel: { // area-label属性值
    type: String,
    default: ''
  }
};
