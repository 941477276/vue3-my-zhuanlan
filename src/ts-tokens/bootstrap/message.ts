import {
  AppContext
} from 'vue';

export type MessageType = 'success' | 'danger' | 'warning' | 'info';

export type MessageBoxType = 'success' | 'danger' | 'warning' | 'info' | 'prompt';

export type MessageFn = (options: any, appContext?: AppContext) => string;

export interface Message extends MessageFn {
  success: MessageFn;
  warning: MessageFn;
  info: MessageFn;
  danger: MessageFn;
  closeAllMessage: () => void;
}

export const supportMessageTypes = ['success', 'danger', 'warning', 'info'];
export const supportMessageBoxTypes = ['success', 'danger', 'warning', 'info', 'prompt'];
