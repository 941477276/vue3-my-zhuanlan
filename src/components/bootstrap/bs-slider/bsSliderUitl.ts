import { BigNumber } from 'bignumber.js';

/**
 * 根据鼠标的位置计算最终值
 * @param mousePosition 鼠标位置
 * @param props props
 * @return {string|number}
 */
export function calcValueByPosition (mousePosition: number, sliderTotalWidth: number, props: any) {
  let propsMin = props.min;
  let propsMax = props.max;
  // 滑块总值
  let totalValue = new BigNumber(propsMax).minus(new BigNumber(propsMin)); // minus 减法
  // 一步对应的值
  let oneStepValue = 100 / totalValue.dividedBy(new BigNumber(props.step)).toNumber();
  // 总步长 = (当前移动的距离 / 滑块总长度 * 100) / 步长值
  let steps = new BigNumber(mousePosition).dividedBy(sliderTotalWidth).multipliedBy(100).dividedBy(oneStepValue);
  // 步长值
  let valueOfSteps = steps.multipliedBy(oneStepValue); // multipliedBy 乘法
  let value = valueOfSteps.multipliedBy(totalValue).dividedBy(100).plus(propsMin);
  let resultValue = convertValue(value.toNumber(), props);
  // console.log('calcValue', resultValue, value);
  return resultValue;
};

/**
 * 转换值
 * @param originValue
 */
export function convertValue (originValue: string|number, props: any) {
  let value = new BigNumber(originValue);
  let propsMin = props.min;
  let propsMax = props.max;
  // 滑块总值
  // let totalValue = new BigNumber(propsMax).minus(new BigNumber(propsMin)); // minus 减法

  if (value.lt(propsMin)) { // lt 判断数是否小于
    value = new BigNumber(propsMin);
  }
  if (value.gt(propsMax)) { // gt判断数是否大于
    value = new BigNumber(propsMax);
  }

  let resultValue: number|string = value.toFixed(props.precision);
  if (props.precision > 0) {
    // 如果有小数点，且小数点最后一位不是0，则将其转换成number类型。如果最后一位是0还将其转换成number类型的化，后面的0会消失
    if (resultValue[resultValue.length - 1] !== '0') {
      resultValue = Number(resultValue);
    }
  } else {
    resultValue = Number(resultValue);
  }
  // console.log('calcValue', resultValue, value);
  return resultValue;
};
