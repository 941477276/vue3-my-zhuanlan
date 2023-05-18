import { ExtractPropTypes } from 'vue';

export const bsBreadcrumbProps = {
  separator: {
    type: String,
    default: '/'
  }
};

export type BsBreadcrumbProps = ExtractPropTypes<typeof bsBreadcrumbProps>;
