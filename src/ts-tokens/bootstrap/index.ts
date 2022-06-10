export * from './form';
export * from './checkbox';
export type BsSize = 'lg' | 'sm';
export type BsColorType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type BsPlacement = 'left' | 'top' | 'bottom' | 'right' | 'leftBottom' | 'topRight' | 'bottomRight' | 'rightBottom';
export type BsPlacementFour = 'left' | 'top' | 'bottom' | 'right';
export type BsInputType = 'text' | 'password' | 'number' | 'textarea' | 'email' | 'file' | 'hidden' | 'image' | 'submit' | 'button' | 'reset';
export type EventCallbackFn = (event?: any) => any;
export type StringKeyObject = {
  [key: string]: any;
}

export const supportedBsColorTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
