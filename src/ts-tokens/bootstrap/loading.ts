import { Ref, VNode } from 'vue';

export interface CreateLoadingOptions {
  // visible: Ref<boolean>,
  text?: Ref<string|number>|string|number;
  grow?: Ref<boolean>|boolean;
  vertical?: Ref<boolean>|boolean;
  color?: Ref<string>|string;
  background?: Ref<string>|string;
  transitionName?: Ref<string>|string;
  spinnerRender?: VNode|(() => VNode); // 自定义渲染spinner函数
  textRender?: VNode|(() => VNode); // 自定义渲染内容函数
};
