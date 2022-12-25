import {
  Component,
  InjectionKey,
  Ref,
  ComputedRef
} from 'vue';

export type BreadcrumbContext = {
  separator: Ref<string>;
  lastChildId: ComputedRef<string|null>;
  // 存储子组件上下文
  addChildComponentContext: (childContext: any) => any;
  // 移除子组件上下文
  removeChildComponentContext: (childContext: any) => any;
};

export const breadcrumbContextKey: InjectionKey<BreadcrumbContext> = Symbol('breadcrumb');
