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

/**
 * 根据区间值计算新的滑块值
 * @param newValue1 滑块1的值
 * @param newValue2 滑块2的值
 * @param props
 * @param value1IsMotionless 滑块1的值是否保持不动
 */
export function getNewValueWithRange (value1:string|number, value2:string|number, props:any, value1IsMotionless = true) {
  let range = props.range;

  if (range) {
    let rangeMin = props.rangeMin;
    let rangeMax = props.rangeMax;
    let diff = new BigNumber(value2).minus(value1);
    if (typeof rangeMin == 'number') { // 判断两个滑块之间的值是否小于区间最小值
      if (diff.lt(rangeMin)) {
        let newValue;
        if (value1IsMotionless) {
          newValue = new BigNumber(value2).plus(new BigNumber(rangeMin).minus(diff));
          if (newValue.gt(props.max) || (typeof rangeMax === 'number' && newValue.minus(value1).gt(rangeMax))) {
            return;
          }
          value2 = convertValue(newValue.toNumber(), props);
        } else {
          newValue = new BigNumber(value1).minus(new BigNumber(rangeMin).minus(diff));
          if (newValue.lt(props.min) || new BigNumber(value2).minus(newValue).lt(rangeMin)) {
            return;
          }
          value1 = convertValue(newValue.toNumber(), props);
        }
      }
    }
    if (typeof rangeMax == 'number') { // 判断两个滑块之间的值是否大于区间最大值
      if (diff.gt(rangeMax)) {
        let newValue;
        if (value1IsMotionless) {
          newValue = new BigNumber(value2).minus(new BigNumber(diff).minus(rangeMax));
          if (newValue.lt(props.min) || (typeof rangeMin === 'number' && newValue.minus(value1).lt(rangeMin))) {
            return;
          }
          value2 = convertValue(newValue.toNumber(), props);
        } else {
          newValue = new BigNumber(value1).plus(new BigNumber(diff).minus(rangeMax));
          console.log('两个滑块区间值大于最大区间值，右侧滑块值不动，滑块1的新值为：', newValue.toNumber(), new BigNumber(diff).minus(rangeMax).toNumber());
          if (newValue.gt(props.max) || new BigNumber(value2).minus(newValue).gt(rangeMax)) {
            return;
          }
          value1 = convertValue(newValue.toNumber(), props);
        }
      }
    }
  }

  return [value1, value2];
};
