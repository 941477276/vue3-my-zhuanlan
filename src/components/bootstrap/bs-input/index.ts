import BsInput from './BsInput.vue';

BsInput.install = function (vueApp: any) {
  vueApp.component(BsInput.name, BsInput);
  return vueApp;
};

export default BsInput;
