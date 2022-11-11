import {
  InjectionKey,
  Ref
} from 'vue';

export type PickerType = 'date' | 'dateTime' | 'week' | 'month' |'quarter' | 'year';

export type DatePickerCtx = {
  ctx: any;
  pickerType?: Ref<string>;
  currentMode?: Ref<string>;
}
export const datePickerCtx: InjectionKey<DatePickerCtx> = Symbol('datePickerCtx');
export const datePickerPrefixColumnSlotCtx = Symbol('prefixColumnSlotCtx');
export const allowedPickerType = ['date', 'dateTime', 'week', 'month', 'quarter', 'year'];
