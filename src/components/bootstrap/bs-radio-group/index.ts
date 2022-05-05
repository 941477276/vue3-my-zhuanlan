import BsRadioGroup from './BsRadioGroup.vue';

BsRadioGroup.install = function (vueApp: any) {
  vueApp.component(BsRadioGroup.name, BsRadioGroup);
  return vueApp;
};

export default BsRadioGroup;
