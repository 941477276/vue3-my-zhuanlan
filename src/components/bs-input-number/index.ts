import BsInputNumber from './BsInputNumber.vue';

BsInputNumber.install = function (vueApp: any) {
  vueApp.component(BsInputNumber.name, BsInputNumber);
  return vueApp;
};

export default BsInputNumber;
