import {
  Ref
} from 'vue';

export function useNavScrollerScroll (navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>) {
  return function (evt: WheelEvent) {
    evt = evt || window.event;
    let isDown = (evt as any).wheelDelta ? (evt as any).wheelDelta < 0 : evt.detail > 0;
    console.log('scroll evt', evt);
  };
};
