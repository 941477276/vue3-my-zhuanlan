import BsMessageBox from './BsMessageBox.vue';

BsMessageBox.install = function (vueApp: any) {
  // vueApp.component(BsMessageBox.name, BsMessageBox);
  return vueApp;
};

export default BsMessageBox;
