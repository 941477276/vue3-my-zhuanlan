import {
  InjectionKey
} from 'vue';

export type TreeContext = {
  ctx: any;
  flatTreeMap: any;
  currentNode: any;
  onNodeExpand: (flag: boolean, nodeData: any, nodeState: any) => void;
  addCheckedKey: (nodeKey: string|number, nodeData: any) => void;
  removeCheckedKey: (nodeKey: string|number, nodeData: any) => void;
  onNodeClick: (nodeData: any, nodeState: any) => void;
};

export const bsTreeContextKey: InjectionKey<TreeContext> = Symbol('bsRootTree');
