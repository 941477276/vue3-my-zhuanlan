import {
  Ref,
  ref,
  unref,
  watch
} from 'vue';
import { BigNumber } from 'bignumber.js';
import { util } from '@/common/util';

/**
 * 根据鼠标的位置计算最终值
 * @param mousePosition 鼠标位置
 * @param props props
 * @return {string|number}
 */
let calcValueByPosition = function (mousePosition: number, sliderTotalWidth: number, props: any) {
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
let convertValue = function (originValue: string|number, props: any) {
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

export function useSliderHandler (props: any, ctx: any, tooltipComRef: any, tooltipVisible: Ref<boolean>, sliderHandlerRef: Ref<HTMLElement|null>) {
  let oldValue = ref(props.modelValue);

  watch(() => props.modelValue, function (newValue) {
    if (oldValue.value != newValue) {
      oldValue.value = newValue;
    }
  });

  let mousedownClientX = 0; // 鼠标按下滑块那一刻鼠标的X轴位置
  let mousedownClientY = 0;
  let sliderRect = {} as DOMRect; // 获取滑块轨道的位置信息
  let sliderTotalWidth = 0; // 滑块轨道的长度
  let sliderStartPosition = 0; // 滑块起始位置
  let isDragging = false;
  let isMouseentered = false;

  let onMousedown = function (evt: MouseEvent) {
    if (props.dispatch) {
      return;
    }
    evt = evt || window.event;
    document.addEventListener('mousemove', documentMousemove, false);
    document.addEventListener('mouseup', documentMouseup, false);
    console.log('onSliderMousedown', evt);
    mousedownClientX = evt.clientX;
    mousedownClientY = evt.clientY;
    sliderRect = unref(props.sliderRef).getBoundingClientRect();
    sliderTotalWidth = props.vertical ? sliderRect.height : sliderRect.width;
    sliderStartPosition = props.vertical ? sliderRect.top : sliderRect.left;
    // console.log(sliderRect, mousedownClientX, mousedownClientY);
  };

  let mouseenterTimer: number;
  let onMouseenter = function () {
    isMouseentered = true;
    tooltipVisible.value = true;
    /* clearTimeout(mouseenterTimer);
    mouseenterTimer = setTimeout(function () {
      clearTimeout(mouseenterTimer);
      updateTooltip();
    }, 250); */
  };

  let onMouseleave = function () {
    isMouseentered = false;
    if (!isDragging) {
      tooltipVisible.value = false;
    }
  };

  let mousemoveTimer = 0;
  let documentMousemove = function (evt: MouseEvent) {
    evt = evt || window.event;
    let now = new Date().getTime();
    if (mousemoveTimer != 0 && mousemoveTimer < 200) {
      return;
    }
    evt.preventDefault();
    mousemoveTimer = now;
    tooltipVisible.value = true;
    isDragging = true;
    let mousePosition = props.vertical ? evt.clientY : evt.clientX;
    // 鼠标移动到的位置
    let positionInSlider = mousePosition - sliderStartPosition;
    // console.log('positionInSlider origin', positionInSlider, oldValue.value);
    if (positionInSlider < 0) {
      positionInSlider = 0;
    }
    if (positionInSlider > sliderTotalWidth) {
      positionInSlider = sliderTotalWidth;
    }

    let newValue = calcValueByPosition(positionInSlider, sliderTotalWidth, props);
    // console.log('positionInSlider after', positionInSlider, newValue);
    if (newValue == oldValue.value) {
      return;
    }

    setValue(newValue);
  };
  let documentMouseup = function (evt: MouseEvent) {
    document.removeEventListener('mousemove', documentMousemove, false);
    document.removeEventListener('mouseup', documentMouseup, false);
    tooltipVisible.value = false;
    isDragging = false;
    let target = evt.target;
    if (target != sliderHandlerRef.value && !util.elementContains(sliderHandlerRef.value, target)) {
      tooltipVisible.value = false;
    }
  };

  let keydownActiveTimer:number;
  let keydownActiveTime = 0;
  let onKeydown = function (evt: KeyboardEvent) {
    evt = evt || window.event;
    if (props.disabled) {
      return;
    }
    let modelValue = props.modelValue;
    let min = props.min;
    let max = props.max;

    let keyCode = evt.keyCode;
    let resultValue:string|number = 0;
    let now = new Date().getTime();
    evt.preventDefault();
    clearTimeout(keydownActiveTimer);
    if (keyCode == 39 || keyCode == 40) { // 右、下
      if (modelValue >= max) {
        return;
      }
      resultValue = convertValue(new BigNumber(modelValue).plus(props.step).toNumber(), props);
    } else if (keyCode == 37 || keyCode == 38) { // 左、上
      if (modelValue <= min) {
        return;
      }
      resultValue = convertValue(new BigNumber(modelValue).minus(props.step).toNumber(), props);
    } else {
      return;
    }
    keydownActiveTime = now;
    tooltipVisible.value = true;
    // 如果1.5秒内未使用键盘更新滑块，则隐藏tooltip
    keydownActiveTimer = setTimeout(function () {
      clearTimeout(keydownActiveTimer);
      if (!isDragging && !isMouseentered) {
        tooltipVisible.value = false;
      }
    }, 1500);
    setValue(resultValue);
  };

  /**
   * 设置值
   * @param newValue
   */
  let setValue = function (newValue: string|number) {
    oldValue.value = newValue;
    ctx.emit('update:modelValue', newValue);
    ctx.emit('change', newValue);

    updateTooltip();
  };

  // 更新tooltip的位置
  let updateTooltip = function () {
    let showToolTip = props.showToolTip;
    if (typeof showToolTip !== 'boolean' || showToolTip === true) {
      tooltipComRef.value?.updatePopper?.();
    }
  };

  return {
    onMousedown,
    onMouseenter,
    onMouseleave,
    onKeydown
  };
};
