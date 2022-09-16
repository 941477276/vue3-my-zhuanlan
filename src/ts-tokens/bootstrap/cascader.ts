import { InjectionKey, Ref } from 'vue';

export type CascaderOptionItem = {
  id?: string;
  value: any;
  label: string|number;
  labelSlot?: string|number;
  disabled?: boolean;
  children?: CascaderOptionItem[];
};
