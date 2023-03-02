import {
  inject
} from 'vue';
import {
  datePickerPrefixColumnSlotCtx
} from '../../../../ts-tokens/bootstrap/date-picker';

export function PrefixColumn (props: any) {
  let prefixColumnSlotCtx: any = inject(datePickerPrefixColumnSlotCtx)!;
  let prefixColumnSlot = prefixColumnSlotCtx?.slots.prefixColumn;
  // console.log(11111, prefixColumnSlot);
  if (prefixColumnSlot) {
    return prefixColumnSlot(props.cellData);
  }
  return null;
};
PrefixColumn.props = ['cellData'];
