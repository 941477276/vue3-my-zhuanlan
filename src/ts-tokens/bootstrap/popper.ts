import {
  InjectionKey,
  Ref
} from 'vue';

export type BsPopperContext = {
  triggerRef: Ref<HTMLElement|null>;
  popperContentRef: Ref<HTMLElement|null>;
  popperArrowRef: Ref<HTMLElement|null>;
};

export const bsPopperContextKey: InjectionKey<BsPopperContext> = Symbol('bsPopperContextKey');
