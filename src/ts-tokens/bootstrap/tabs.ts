import {
  Ref,
  InjectionKey
} from 'vue';
// 标签的位置
export type TabPosition = 'top' | 'left' | 'right' | 'bottom';
// 当标签导航列表宽度超出父容器时选择超出部分标签导航的方式
export type TriggerTypeOnOverflow = 'auto' | 'more' | 'button';
export type HiddenTabInfo = {
  id: string;
  disabled: boolean;
  text?: string|undefined;
};
export type TabNavItem = {
  name: string;
  id: string;
  label: string;
  itemSlot: any;
  disabled: boolean;
  closeable: boolean;
};
export type TabsPaneContext = {
  id: string;
  index: number;
  name: string;
  label: string;
  disabled: boolean;
  closeable: boolean;
  labelSlot: { label?: () => any; };
};
export type TabsContext = {
  activeTabId: Ref<string>;
  // 存储子组件上下文
  addChildComponentContext: (childContext: TabsPaneContext) => any;
  // 移除子组件上下文
  removeChildComponentContext: (childContext: TabsPaneContext) => any;
};

export const bsTabsContextKey: InjectionKey<string> = Symbol('bsTabsContextKey');
