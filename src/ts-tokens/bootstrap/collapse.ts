import {
  Ref,
  InjectionKey
} from 'vue';
export type CollapseItemContext = {
  id: string;
  expand: () => void;
  shrink: () => void;
  name: Ref<string>
};

export type CollapseContext = {
  activeNames: Ref<(string|number)[]>;
  handleItemChange: (expended: boolean, name: string|number) => any;
  // 存储子组件上下文
  // addChildComponentContext: (childContext: CollapseItemContext) => any;
  // 移除子组件上下文
  // removeChildComponentContext: (childContext: CollapseItemContext) => any;
};

export const bsCollapseContextKey: InjectionKey<CollapseContext> = Symbol('bsCollapseContext');
