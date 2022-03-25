// 统计单选框数量
let radioCount = 0;
// 统计复选框数量
let checkboxCount = 0;
// 统计input数量
let inputCount = 0;
let textareaCount = 0;
let selectCount = 0;
let selectOptionCount = 0;

export function getRadioCount (): number {
  return ++radioCount;
};
export function getCheckboxCount (): number {
  return ++checkboxCount;
};
export function getInputCount (): number {
  return ++inputCount;
};
export function getTextAreaCount (): number {
  return ++textareaCount;
};
export function getSelectCount (): number {
  return ++selectCount;
};

export function getSelectOptionCount (): number {
  return ++selectOptionCount;
};
