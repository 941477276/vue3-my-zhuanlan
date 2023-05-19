import { PropType, ExtractPropTypes } from 'vue';
import { TabPosition, TriggerTypeOnOverflow } from '../../ts-tokens/bootstrap/tabs';

export const bsTabsProps = {
  modelValue: { // 绑定值，选中选项卡的 name
    type: String,
    default: ''
  },
  tabPosition: { // 标签的位置
    type: String as PropType<TabPosition>,
    default: 'top'
  },
  triggerTypeOnOverflow: { // 当标签导航列表宽度超出父容器时选择超出部分标签导航的方式
    type: String as PropType<TriggerTypeOnOverflow>,
    default: 'auto'
  },
  hiddenTabsGreaterThan: { // 当triggerTypeOnOverflow为auto时，隐藏掉的标签导航个数达到该阈值时才会使用'more'
    type: Number,
    default: 10
  },
  tabBarMaxHeight: { // 标签导航最大高度
    type: [String, Number],
    default: 0
  },
  inkBarSpaceBetween: { // 标签导航高亮条向两端延伸的长度
    type: Number,
    default: 0
  },
  closeable: { // 是否可关闭
    type: Boolean,
    default: false
  }
};

export const bsTabPaneProps = {
  label: { // 选项卡标题
    type: String,
    default: ''
  },
  name: { // 与选项卡绑定值 modelValue 对应的标识符，表示选项卡别名
    type: String,
    default: ''
  },
  closeable: { // 是否可关闭
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  lazy: { // 选项卡内容是否延迟渲染
    type: Boolean,
    default: false
  },
  contentLazyRender: { // 内容延迟渲染，只有在第一次选中后才会被渲染
    type: Boolean,
    default: true
  }
};

export type BsTabsProps = ExtractPropTypes<typeof bsTabsProps>;
export type BsTabPaneProps = ExtractPropTypes<typeof bsTabPaneProps>;
