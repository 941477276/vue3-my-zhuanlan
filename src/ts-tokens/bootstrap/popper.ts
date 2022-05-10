import {
  InjectionKey,
  Ref
} from 'vue';
import { Instance as PopperInstance } from '@popperjs/core';

export type BsPopperContext = {
  triggerRef: Ref<HTMLElement|null>;
  popperContentRef: Ref<HTMLElement|null>;
  popperArrowRef: Ref<HTMLElement|null>;
  popperInstanceRef: Ref<PopperInstance|undefined>;
};

// 触发popper的事件类型
export type PopperTriggerType = 'click' | 'hover' | 'focus' | 'contextmenu';

export type BsTooltipContext = {
  show: () => void;
  hide: () => void;
  isShow: Ref<boolean>;
  trigger: Ref<string>;
};

export const bsPopperContextKey: InjectionKey<BsPopperContext> = Symbol('bsPopperContextKey');

export const bsTooltipContextKey: InjectionKey<BsTooltipContext> = Symbol('bsTooltipContextKey');
