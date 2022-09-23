import { InjectionKey, Ref } from 'vue';

export type SelectOptionItem = {
  id?: string;
  value: any;
  label: string|number;
  labelSlot?: string|number;
  disabled?: boolean;
};

export type SelectContext = {
  ctx?: any;
  props: any;
  filterText?: string;
  filterMethod: (option: SelectOptionItem) => boolean;
  changeVal: (val: any, isDelete?: boolean) => void;
  addOption: (option: SelectOptionItem) => void;
  removeOption: (optionId: string, value: any) => void;
};

export type SelectOptionGroupContext = {
  props: any
};

export const selectContextKey: InjectionKey<SelectContext> = Symbol('select');
export const selectOptionGroupContextKey: InjectionKey<SelectContext> = Symbol('selectOptionGroup');
