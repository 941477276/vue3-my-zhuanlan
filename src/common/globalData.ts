// 统计input数量
let inputCount = 0;
let textareaCount = 0;
let selectCount = 0;
let selectOptionCount = 0;

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
