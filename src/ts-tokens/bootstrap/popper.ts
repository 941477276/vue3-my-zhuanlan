import {
  InjectionKey,
  Ref
} from 'vue';
import { Instance as PopperInstance } from '@popperjs/core';

export type BsPopperContext = {
  triggerRef: Ref<HTMLElement|null>;
  popperContentRef: Ref<HTMLElement|null>;
  popperArrowRef: Ref<HTMLElement|null>;
  popperInstance: Ref<PopperInstance|undefined>;
};

export const bsPopperContextKey: InjectionKey<BsPopperContext> = Symbol('bsPopperContextKey');
