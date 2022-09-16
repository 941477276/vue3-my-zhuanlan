import { InjectionKey, Ref } from 'vue';

export type CascaderOptionItem = {
  id?: string;
  value: string|number;
  label: string|number;
  labelSlot?: string|number;
  disabled?: boolean;
  children?: CascaderOptionItem[];
};

export type CascaderExpandedMenuItem = {
 menuId: string;
 menuItemValue?: string|number;
 menuOptions: CascaderOptionItem[];
};
