// 统计单选框数量
let radioCount = 0;
// 统计复选框数量
let checkboxCount = 0;

export function getRadioCount (): number {
  return ++radioCount;
};
export function getCheckboxCount (): number {
  return ++checkboxCount;
};
