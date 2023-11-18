import {
  defineComponent, AppContext, computed, ref, inject, onBeforeUnmount
} from 'vue';
import { BsTableCustomContent } from './BsTableCustomContent';
import BsTooltip from '../../../components/bs-tooltip/BsTooltip.vue';
import { bsTableCellProps } from './bs-table-cell-props';
import { isFunction } from '@vue/shared';
import { eleTextOverflow } from '../../../utils/bs-util';
import { bsTableCtxKey } from '../bs-table-types';

export default defineComponent({
  name: 'BsTableCellContent',
  props: {
    ...bsTableCellProps
  },
  // @ts-ignore
  setup (props: any, ctx: AppContext) {
    let tableCtx = inject(bsTableCtxKey)!;

    // 文本内容
    let cellContent = computed(function () {
      let customCell = props.column.customCell;
      if (isFunction(customCell)) {
        return customCell;
      }
      return props.rowData[props.column.prop];
    });

    let textElRef = ref<HTMLElement>();
    let tooltipContent = ref('');
    let textIsOverflow = ref(false);

    let timer: number;
    let calcTextIsOverflow = function () {
      if (!textElRef.value) {
        textIsOverflow.value = false;
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(function () { // 解决在resize事件中频繁计算问题
        clearTimeout(timer);
        textIsOverflow.value = eleTextOverflow(textElRef.value!);
      }, 0);
    };

    tableCtx.addResizeEvent(calcTextIsOverflow);

    onBeforeUnmount(function () {
      tableCtx.removeResizeEvent(calcTextIsOverflow);
    });

    return {
      cellContent,
      textElRef,
      tooltipContent,
      textIsOverflow,
      calcTextIsOverflow
    };
  },
  render () {
    let {
      ellipsis,
      showTooltip
      // @ts-ignore
    } = this.column;
    // @ts-ignore
    let $slots = this.$slots;

    let customContent = () => {
      // @ts-ignore
      return (
        <BsTableCustomContent
          // @ts-ignore
          row-index={ this.rowIndex }
          // @ts-ignore
          cell-index={ this.cellIndex }
          // @ts-ignore
          row-data={ this.rowData }
          // @ts-ignore
          label={ this.cellContent }
          // @ts-ignore
          table-slots={ this.tableSlots }
          // @ts-ignore
          default-content={ $slots.default }
          // @ts-ignore
          slot-name={ this.slotName || this.column.prop }>
        </BsTableCustomContent>
      );
    };

    let ellipsisClass = 'bs-table-cell-ellipsis';

    if (showTooltip) {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        // @ts-ignore
        let textEl = this.$refs.textElRef;
        // console.log('textElRef.value', textEl.innerText);
        // @ts-ignore
        this.calcTextIsOverflow();
        // @ts-ignore
        this.tooltipContent = textEl?.innerText || textEl?.textContent || '';
      }, 60);
      let tooltipProps = {
        placement: 'top',
        transitionName: 'scale',
        ...(typeof showTooltip == 'object' ? showTooltip : {}),
        // @ts-ignore
        disabled: this.tooltipContent.length == 0 || !this.textIsOverflow,
        // @ts-ignore
        content: this.tooltipContent
      };
      if (tooltipProps.disabled) {
        return (<div ref="textElRef" class={[ellipsisClass, 'bs-table-cell-show-tooltip']}>{customContent()}</div>);
      }
      return (
        <BsTooltip {...tooltipProps}>
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
