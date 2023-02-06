export * from './form';
export * from './checkbox';
export type BsSize = 'lg' | '' | 'sm';
export type BsTextAlign = 'left' | 'center' | 'right';
export type BsColorType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type BsPlacement = 'left' | 'top' | 'bottom' | 'right';
export type BsPlacementEnd = 'leftEnd' | 'topEnd' | 'bottomEnd' | 'rightEnd';
export type BsPlacementEndKebab = 'left-end' | 'top-end' | 'bottom-end' | 'right-end';
// export type BsPlacement = 'left' | 'top' | 'bottom' | 'right' | 'leftEnd' | 'topEnd' | 'bottomEnd' | 'rightEnd';
export type BsPlacementFour = 'left' | 'top' | 'bottom' | 'right';
export type BsInputType = 'text' | 'password' | 'number' | 'textarea' | 'email' | 'file' | 'hidden' | 'image' | 'submit' | 'button' | 'reset';
export type EventCallbackFn = (event?: any) => any;
export type StringKeyObject = {
  [key: string]: any;
}

export const supportedBsColorTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
