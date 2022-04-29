let currentClickedElement: HTMLElement|null;

// @ts-ignore
document.documentElement.addEventListener('click', function (evt: KeyboardEvent) {
  currentClickedElement = (evt || window.event).target as HTMLElement;
}, false);
console.log('useGetCurrentClickedElement bind event!');
/**
 * 获取当前点击的元素
 */
export function useGetCurrentClickedElement () {
  return currentClickedElement;
};
