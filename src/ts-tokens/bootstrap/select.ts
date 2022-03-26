import { InjectionKey } from 'vue';

export type SelectOptionItem = {
  id: string,
  value: any,
  label: any,
  disabled: boolean
};

export type SelectContext = {
  props: any;
  changeVal: (val: any, isDelete?: boolean) => void;
  addOption: (option: SelectOptionItem) => void;
  removeOption: (optionId: string, value: any) => void;
};

export type SelectOptionGroupContext = {
  props: any
};

export const selectContextKey: InjectionKey<SelectContext> = Symbol('select');
export const selectOptionGroupContextKey: InjectionKey<SelectContext> = Symbol('selectOptionGroup');
