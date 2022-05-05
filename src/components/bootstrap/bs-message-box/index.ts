import {
  BsMessageBox,
  closeMessageBox,
  closeAllMessageBox
} from './bs-message-box';

export {
  BsMessageBox,
  closeMessageBox,
  closeAllMessageBox
};

export default {
  install (app: any) {
    // 全局挂载 $messageBox 函数
    app.config.globalProperties.$messageBox = BsMessageBox;
    app.config.globalProperties.$closeAllMessageBox = closeAllMessageBox;
    app.config.globalProperties.$closeMessageBox = closeMessageBox;
    return app;
  }
};
