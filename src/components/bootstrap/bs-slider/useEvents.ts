import {
  Ref,
  onMounted,
  onBeforeUnmount
} from 'vue';

export default function (props: any, currentValue: Ref<number|number[]>, setValue: (value1?: number, value2?: number) => void, sliderRef: Ref<HTMLElement|null>) {
  let onSliderHandlerMousedown = function (sliderNumber: number, evt: MouseEvent) {
    console.log('onSliderHandlerMousedown', sliderNumber, evt);
  };

  return {
    onSliderHandlerMousedown
  };
};
