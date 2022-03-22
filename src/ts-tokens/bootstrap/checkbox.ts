import { InjectionKey } from 'vue';

export type CheckboxGroupContext = {
  props: any;
  changeVal: (val: string|number|boolean) => void;
};
export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol('checkboxGroup');
