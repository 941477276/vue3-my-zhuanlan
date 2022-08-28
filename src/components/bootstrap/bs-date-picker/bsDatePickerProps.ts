import { PropType } from 'vue';
import { PickerType } from '@/ts-tokens/bootstrap/date-picker';
import { BsSize } from '@/ts-tokens/bootstrap';

export const bsDatePickerProps = {
  modelValue: {
    type: [String, Object],
    default: ''
  },
  pickerType: {
    type: String as PropType<PickerType>,
    default: 'date'
  },
  format: { // 日期显示的格式
    type: String,
    default: ''
  },
  valueFormat: { // 绑定值的格式
    type: String,
    default: ''
  },
  showHeader: { // 是否显头部
    type: Boolean,
    default: true
  },
  showFooter: { // 是否显示底部
    type: Boolean,
    default: null
  },
  disabled: { // 是否禁用
    type: Boolean,
    default: false
  },
  inputReadOnly: { // 设置输入框为只读（避免在移动设备上打开虚拟键盘）
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
  name: { // input输入框的name属性
    type: String,
    default: null
  },
  showSidebar: { // 是否显示侧边栏
    type: Boolean,
    default: false
  },
  /* showTime: { // 是否开启选择时间功能
    type: [Boolean, Object],
    default: false
  }, */
  sidebarAlign: { // 侧边栏显示位置
    type: String,
    default: 'left'
  },
  shortcuts: { // 侧边栏快捷按钮
    type: Array,
    default () {
      return [];
    }
  },
  dateRender: { // 自定义日期单元格的内容
    type: Function,
    default: null
  },
  placeholder: { // 输入框提示文字
    type: String,
    default: ''
  },
  disabledDate: { // 禁用的日期
    type: Function,
    default: null
  },
  dropdownClassName: { // 下拉弹窗的额外classname
    type: String,
    default: ''
  },
  datePanelProps: { // 日期选择器props
    type: Object,
    default () {
      return {};
    }
  },
  timePanelProps: { // 时间选择器props
    type: Object,
    default () {
      return {};
    }
  }
};
