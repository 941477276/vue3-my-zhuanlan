import {
  InjectionKey
} from 'vue';

export type TreeContext = {
  ctx: any
};

export const bsTreeContextKey: InjectionKey<TreeContext> = Symbol('bsRootTree');
