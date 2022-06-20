import {
  InjectionKey
} from 'vue';

export type TreeContext = {
  ctx: any;
  flatTreeMap: any;
  currentNode: any;
  onNodeExpand: (flag: boolean, nodeData: any) => void;
};

export const bsTreeContextKey: InjectionKey<TreeContext> = Symbol('bsRootTree');
