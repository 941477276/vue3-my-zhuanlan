import { ExtractPropTypes } from 'vue';

export const bsBreadcrumbItemProps = {
  to: {
    type: [String, Object],
    default: ''
  },
  replace: { // 是否不将导航在历史记录中留下
    type: Boolean,
    default: false
  },
  disabled: { // 是否禁用
    type: Boolean,
    default: false
  },
  isUrl: { // 是否为普通链接
    type: Boolean,
    default: false
  },
  target: { // a标签的target属性
    type: String,
    default: ''
  }
};

export const bsBreadcrumbProps = {
  separator: {
    type: String,
    default: '/'
  }
};

export type BsBreadcrumbItemProps = ExtractPropTypes<typeof bsBreadcrumbItemProps>;
export type BsBreadcrumbProps = ExtractPropTypes<typeof bsBreadcrumbProps>;
