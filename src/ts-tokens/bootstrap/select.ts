import { InjectionKey } from 'vue';

export type SelectContext = {
  props: any,
  changeVal: (val: any, isDelete?: boolean) => void
};

export type SelectOptionGroupContext = {
  props: any
};

export const selectContextKey: InjectionKey<SelectContext> = Symbol('select');
export const selectOptionGroupContextKey: InjectionKey<SelectContext> = Symbol('selectOptionGroup');
