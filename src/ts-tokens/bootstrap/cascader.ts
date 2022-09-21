import { InjectionKey, Ref } from 'vue';

export interface CascaderOptionItem {
  id?: string;
  value?: string|number;
  label?: string|number;
  labelSlot?: string|number;
  disabled?: boolean;
  tagType?: string;
  children?: CascaderOptionItem[];
};

export interface CheckedOptions {
  [key: string]: CascaderOptionItem[]
};

export interface CascaderExpandedMenuItem {
 menuId: string;
 menuItemValue?: string|number;
 menuOptions: CascaderOptionItem[];
};

export interface CascaderFieldNames {
  label: string;
  value: string;
  children: string;
  disabled: string;
  leaf: string;
};
