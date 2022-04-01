import {
  AppContext
} from 'vue';

export type MessageType = 'success' | 'danger' | 'warning' | 'info';

export type MessageFn = (options: any, appContext?: AppContext) => string;

export interface Message extends MessageFn {
  success: MessageFn;
  warning: MessageFn;
  info: MessageFn;
  danger: MessageFn;
  closeAllMessage: () => void;
}

export const supportMessageTypes = ['success', 'danger', 'warning', 'info'];
