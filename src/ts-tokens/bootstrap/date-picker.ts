import { InjectionKey } from 'vue';

export type PickerType = 'date' | 'week' | 'month' |'quarter' | 'year';

export type DatePickerCtx = {
  ctx: any;
}
export const datePickerCtx: InjectionKey<DatePickerCtx> = Symbol('datePickerCtx');
export const datePickerPrefixColumnSlotCtx = Symbol('prefixColumnSlotCtx');
