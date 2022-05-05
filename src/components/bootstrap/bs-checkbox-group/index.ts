import BsCheckboxGroup from './BsCheckboxGroup.vue';

BsCheckboxGroup.install = function (vueApp: any) {
  vueApp.component(BsCheckboxGroup.name, BsCheckboxGroup);
  return vueApp;
};

export default BsCheckboxGroup;
