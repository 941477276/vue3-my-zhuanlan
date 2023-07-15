import { isFunction } from '@vue/shared';
import { camelCase2KebabCase } from '../../../utils/bs-util';

/**
 * 单元格内容组件
 * @param props
 * @constructor
 */
export function BsTableCellContent (props: any) {
  let slot = props.tableSlots?.[props.slotName] || props.tableSlots?.[camelCase2KebabCase(props.slotName)];
  let parentDefaultSlot = props.defaultContent;
  // 优先渲染插槽里的内容
  if (parentDefaultSlot || slot) {
    let slotFn = parentDefaultSlot || slot;
    return slotFn({
      rowIndex: props.rowIndex,
      cellIndex: props.cellIndex,
      row: props.rowData
    });
  }
  let label = props.label;
  if (isFunction(label)) {
    if (props.isHeadCell) {
      return label(props.cellIndex, props.column);
    }
    return label(props.rowData, props.cellIndex, props.rowIndex);
  }
  return label;
};

BsTableCellContent.props = ['label', 'tableSlots', 'defaultContent', 'slotName', 'rowIndex', 'rowData', 'cellIndex', 'column', 'isHeadCell'];
