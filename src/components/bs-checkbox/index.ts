import BsCheckbox from './BsCheckbox.vue';

BsCheckbox.install = function (vueApp: any) {
  vueApp.component(BsCheckbox.name, BsCheckbox);
  return vueApp;
};

export default BsCheckbox;
