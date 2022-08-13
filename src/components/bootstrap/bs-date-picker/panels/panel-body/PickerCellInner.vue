<script lang="ts">
import {
  inject,
  h,
  defineComponent
} from 'vue';
import { datePickerCtx, DatePickerCtx } from '@/ts-tokens/bootstrap/date-picker';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'PickerCellInner',
  props: {
    getCellNode: { // 自定义单元格的渲染内容
      type: Function,
      default: null
    },
    cellData: {
      type: Object,
      default () {
        return {};
      }
    },
    cellIndex: {
      type: Number
    }
  },
  setup (props: any, ctx: any) {
    let datePicker = inject<DatePickerCtx>(datePickerCtx)!;
    let now = dayjs();
    console.log('datePicker', datePicker);
    return function () {
      let cellData = props.cellData;
      let getCellNode = props.getCellNode;
      let slot;
      if (typeof getCellNode === 'function') {
        slot = getCellNode;
      } else {
        let dateRenderSlot = datePicker.ctx.slots.dateRender;
        slot = dateRenderSlot || ctx.slots.default;
      }

      return h('div', {
        'class': 'bs-picker-cell-inner'
      }, slot({
        current: cellData.dayjsIns,
        now,
        cellIndex: cellData.cellIndex
      }));
    };
  }
});
</script>
