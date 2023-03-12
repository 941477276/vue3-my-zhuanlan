import {
  PropType
} from 'vue';
import {
  BsMenuMode,
  BsSubMenuDisplayMode
} from '../../ts-tokens/bootstrap/menu';

export const bsMenuProps = {
  mode: { // 菜单类型
    type: String as PropType<BsMenuMode>,
    default: 'horizontal'
  },
  collapse: { // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
    type: Boolean,
    default: false
  },
  autoScrollToSelectedMenu: { // 是否自动滚动到选中的第一个菜单，仅在mode=vertical并且有滚动条的情况下有效
    type: Boolean,
    default: true
  },
  indent: { // 菜单为垂直模式时的缩进宽度
    type: Number,
    default: 16
  },
  indentUnit: { // 菜单为垂直模式时缩进宽度的单位
    type: String,
    default: 'px'
  },
  openedKeys: { // 当前展开的 SubMenu 菜单项 key 数组
    type: Array,
    default () {
      return [];
    }
  },
  uniqueOpened: { // 是否只保持同级的子菜单只有一个展开
    type: Boolean,
    default: false
  },
  selectedKeys: { // 当前选中的菜单项 key 数组
    type: [Array, String],
    default () {
      return [];
    }
  },
  subMenuTrigger: { // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
    type: String,
    default: ''
  },
  subMenuDisplayMode: { // 子菜单展现形式
    type: String as PropType<BsSubMenuDisplayMode>,
    default: ''
  }
};
