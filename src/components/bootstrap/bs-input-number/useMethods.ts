import {
  Ref
} from 'vue';
import { BigNumber } from 'bignumber.js';
// 转换数据
let processValue = function (value: string|number, actionType: number, step: number, min: number, max: number, precision: number) {
  let preciseVal = new BigNumber(value || 0);
  // console.log('preciseVal', preciseVal, value || 0);

  if (actionType == 1) { // 加
    preciseVal = preciseVal.plus(step || 1);
  } else if (actionType == 2) { // 减
    preciseVal = preciseVal.minus(step || 1);
  }

  let resultVal: string|number;
  if (typeof max === 'number' && preciseVal.comparedTo(max) == 1) {
    // val = max;
    preciseVal = new BigNumber(max);
  } else if (typeof min === 'number' && preciseVal.comparedTo(min) == -1) {
    // val = min;
    preciseVal = new BigNumber(min);
  }

  // 处理精度问题
  if (precision && precision > 0) {
    resultVal = preciseVal.toFixed(precision);
  } else {
    resultVal = preciseVal.toString();
  }
  return resultVal;
};

export function useInputNumberMethods (props: any, ctx: any, callFormItem: any, inputRef: Ref<HTMLInputElement|null>) {
  // 执行计算
  let calculate = function (type = 1) {
    let modelVal = props.modelValue;
    let max = props.max;
    let min = props.min;
    if (type == 1 && typeof max === 'number' && modelVal >= max) {
      return;
    }
    if (type == 2 && typeof min === 'number' && modelVal <= min) {
      return;
    }
    let val = processValue(modelVal, type, props.step, min, max, props.precision);
    ctx.emit('update:modelValue', val);
    // setValue(val);
    ctx.emit('change', val);
    callFormItem('validate', 'change');
    // 防止因执行计算后由于小数点精度问题，modelValue的值实际没变化，而输入框的值被手动更改了，而导致输入框显示的值与modelValue不一致问题
    setTimeout(function () {
      let targetVal = (inputRef.value as HTMLInputElement).value + '';
      let inputViewVal = val;
      if (typeof props.formatter === 'function') {
        inputViewVal = props.formatter(val);
      }
      // console.log('targetVal', targetVal, val);
      if (targetVal !== (inputViewVal + '')) {
        (inputRef.value as HTMLInputElement).value = (inputViewVal + '');
      }
    }, 0);
  };

  // input事件
  /* eslint-disable */
  let on_input = function (evt: InputEvent) {
    // ctx.emit('update:modelValue', val);
    ctx.emit('input', evt);

    callFormItem('validate', 'input');
  };
  let on_focus = function (evt: Event) {
    ctx.emit('focus', evt);
    callFormItem('validate', 'focus');
  };
  let on_blur = function (evt: Event) {
    let targetVal = (evt.target as HTMLInputElement).value + '';
    let val: number | string;
    let parser = props.parser;
    // console.log('on_blur', targetVal);
    if (targetVal.length == 0 && typeof props.min !== 'number') {
      ctx.emit('update:modelValue', '');
      ctx.emit('change', '');
      return;
    }
    // console.log(22);
    if (typeof props.formatter === 'function' && typeof props.parser !== 'function') {
      console.warn('formatter应与parser配合使用！');
    }
    if (typeof props.parser === 'function') {
      targetVal = parser(targetVal);
    }
    if (targetVal == props.modelValue) {
      return;
    }

    val = processValue(targetVal, 3, props.step, props.min, props.max, props.precision);
    // console.log('val', val);
    ctx.emit('update:modelValue', val);
    ctx.emit('change', val);
    callFormItem('validate', 'change');
    ctx.emit('blur', evt);
    // 防止因执行计算后由于小数点精度问题，modelValue的值实际没变化，而输入框的值被手动更改了，而导致输入框显示的值与modelValue不一致问题
    setTimeout(function () {
      let targetVal = (evt.target as HTMLInputElement).value + '';
      let inputViewVal = val;
      if (typeof props.formatter === 'function') {
        inputViewVal = props.formatter(val);
      }
      if (targetVal !== (val + '')) {
        (evt.target as HTMLInputElement).value = (inputViewVal + '');
      }
    }, 0);
    callFormItem('validate', 'blur');
  };
  /* let on_change = function (evt: Event) {
    // let val = (evt.target as HTMLInputElement).value;
    ctx.emit('change', evt);
    callFormItem('validate', 'change');
  }; */
  let on_keydown = function (evt: KeyboardEvent) {
    let keyCode = evt.keyCode;
    if (!props.keyboard) {
      return;
    }
    if (keyCode == 38) { // 上
      calculate(1);
    } else if (keyCode == 40) { // 下
      calculate(2);
    }
  };

  return {
    on_input,
    on_focus,
    on_blur,
    // on_change,
    on_keydown,
    calculate
  };
};