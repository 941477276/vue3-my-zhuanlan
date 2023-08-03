import {
  defineComponent,
  AppContext, computed, ref
} from 'vue';
import { BsTableCustomContent } from './BsTableCustomContent';
import BsTooltip from '../../../components/bs-tooltip/BsTooltip.vue';
import { bsTableCellProps } from './bs-table-cell-props';
import { isFunction } from '@vue/shared';

export default defineComponent({
  name: 'BsTableCellContent',
  props: {
    ...bsTableCellProps
  },
  setup (props: any, ctx: AppContext) {
    let cellContent = computed(function () {
      let customCell = props.column.customCell;
      if (isFunction(customCell)) {
        return customCell;
      }
      return props.rowData[props.column.prop];
    });
    let textElRef = ref<HTMLElement>();
    let tooltipContent = ref('');

    return {
      cellContent,
      textElRef,
      tooltipContent
    };
  },
  render () {
    let {
      ellipsis,
      showTooltip
    } = this.column;
    let $slots = this.$slots;
    console.log('showTooltip', showTooltip, ellipsis);
    let customContent = () => {
      return (
        <BsTableCustomContent
          row-index={ this.rowIndex }
          cell-index={ this.cellIndex }
          row-data={ this.rowData }
          label={ this.cellContent }
          table-slots={ this.tableSlots }
          default-content={ $slots.default }
          slot-name={ this.slotName || this.column.prop }>
        </BsTableCustomContent>
      );
    };

    let ellipsisClass = 'bs-table-cell-ellipsis';

    if (showTooltip) {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        let textEl = this.$refs.textElRef;
        console.log('textElRef.value', textEl.innerText);
        this.tooltipContent = textEl?.innerText || textEl?.textContent || '';
      }, 60);
      console.log(111111);
      return (
        <BsTooltip disabled={this.tooltipContent.length == 0} placement="top" transitionName="scale" content={this.tooltipContent}>
          <div ref="textElRef" class={[ellipsisClass, 'bs-table-cell-show-tooltip']}>{ customContent() }</div>
        </BsTooltip>
      );
    }
    if (ellipsis) {
      return (<div class={ellipsisClass}>{ customContent() }</div>);
    }
    return customContent();
  }
});
