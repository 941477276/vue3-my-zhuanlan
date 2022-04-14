// 标签的位置
export type TabPosition = 'top' | 'left' | 'right' | 'bottom';
// 当标签导航列表宽度超出父容器时选择超出部分标签导航的方式
export type TriggerTypeOnOverflow = 'auto' | 'more' | 'button';
export type HiddenTabInfo = {
  id: string;
  disabled: boolean;
};
