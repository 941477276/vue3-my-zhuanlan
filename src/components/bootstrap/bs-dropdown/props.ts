import { PropType } from 'vue';
import { BsPlacement } from '@/ts-tokens/bootstrap';
export type BsDropdownTrigger = 'click' | 'hover';

export const bsDropdownProps = {
  teleported: { // 是否使用 teleport。设置成 true则会被追加到 append-to 的位置
    type: Boolean,
    default: false
  },
  appendTo: { // 下拉菜单即将插入到的父级元素
    type: String,
    default: 'body'
  },
  placement: { // 显示方向
    type: String as PropType<BsPlacement>,
    default: 'bottom'
  },
  tryReverseDirection: { // 当在props.direction方向不能完全显示时，是否尝试反方向显示
    type: Boolean,
    default: true
  },
  tryAllDirection: { // 当在props.direction方向不能完全显示时，是否尝试所有方向显示
    type: Boolean,
    default: false
  },
  trigger: { // 触发下拉菜单显示的事件
    type: String as PropType<BsDropdownTrigger>,
    default: 'hover'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  lazy: { // 是否延迟渲染
    type: Boolean,
    default: true
  },
  addDropdownToggleClass: { // 是否给触发下拉菜单元素添加 dropdown-toggle 类名
    type: Boolean,
    default: true
  },
  destroyDropdownMenuOnHide: { // 隐藏时是否销毁 dropdown-menu
    type: Boolean,
    default: false
  },
  dropdownMenuClass: { // .dropdown-menu的额外class
    type: String,
    default: ''
  }
};
