import {
  Ref,
  ref,
  unref,
  watch
} from 'vue';
import { BigNumber } from 'bignumber.js';
import { util } from '@/common/util';
import {
  calcValueByPosition,
  convertValue
} from '../bsSliderUitl';

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

  let onMousedown = function (evt: MouseEvent|TouchEvent) {
    if (props.dispatch) {
      return;
    }
    evt = evt || window.event;
    evt.preventDefault();
    document.addEventListener('mousemove', documentMousemove, false);
    document.addEventListener('mouseup', documentMouseup, false);

    // @ts-ignore
    document.addEventListener('touchmove', documentMousemove, {
      passive: false, // 解决touchmove无法处理e.prevetDefault（）问题
      capture: false
    });
    // @ts-ignore
    document.addEventListener('touchend', documentMouseup, false);
    // @ts-ignore
    document.addEventListener('touchcancel', documentMouseup, false);
    console.log('onSliderMousedown', evt);

    if (evt.type === 'touchmove') {
      let touch = (evt as TouchEvent).touches[0];
      mousedownClientX = touch.clientX;
      mousedownClientY = touch.clientY;
    } else {
      mousedownClientX = (evt as MouseEvent).clientX;
      mousedownClientY = (evt as MouseEvent).clientY;
    }
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
  let documentMousemove = function (evt: MouseEvent|TouchEvent) {
    evt = evt || window.event;
    let now = new Date().getTime();
    if (mousemoveTimer != 0 && mousemoveTimer < 200) {
      return;
    }
    let clientX = 0;
    let clientY = 0;
    if (evt.type === 'touchmove') {
      let touch = (evt as TouchEvent).touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (evt as MouseEvent).clientX;
      clientY = (evt as MouseEvent).clientY;
    }

    console.log('mouse move', evt);
    evt.preventDefault();
    mousemoveTimer = now;
    tooltipVisible.value = true;
    isDragging = true;
    let mousePosition = props.vertical ? clientY : clientX;
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
    console.log('positionInSlider after', positionInSlider, newValue);
    if (newValue == oldValue.value) {
      return;
    }

    setValue(newValue);
  };
  let documentMouseup = function (evt: MouseEvent) {
    document.removeEventListener('mousemove', documentMousemove, false);
    document.removeEventListener('mouseup', documentMouseup, false);

    // @ts-ignore
    document.removeEventListener('touchmove', documentMousemove, {
      passive: false, // 解决touchmove无法处理e.prevetDefault（）问题
      capture: false
    });
    // @ts-ignore
    document.removeEventListener('touchend', documentMouseup, false);
    // @ts-ignore
    document.removeEventListener('touchcancel', documentMouseup, false);
    console.log('documentMouseup');
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
