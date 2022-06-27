import {
  Ref,
  InjectionKey
} from 'vue';
import { StringKeyObject } from '@/ts-tokens/bootstrap/index';

// 节点信息
export interface BsNodeInfo {
  node: StringKeyObject;
  nodeLevelPath: string;
};

export type BsNodeData = StringKeyObject;

export type TreeContext = {
  ctx: any;
  flatTreeNodeInfoArr: Ref<BsNodeInfo[]>;
  halfCheckedKeys: Ref<(string|number)[]>;
  currentNode: any;
  onNodeExpand: (flag: boolean, nodeData: any, nodeState: any) => void;
  addCheckedKey: (nodeKey: string|number, nodeData: any) => void;
  removeCheckedKey: (nodeKey: string|number, nodeData: any) => void;
  onNodeClick: (nodeData: any, nodeState: any) => void;
};

export const bsTreeContextKey: InjectionKey<TreeContext> = Symbol('bsRootTree');
