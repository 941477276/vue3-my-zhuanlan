import { InjectionKey } from 'vue';

export type RadioGroupContext = {
  props: any;
  changeVal: (val: string|number|boolean) => void;
};
export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('radioGroup');
