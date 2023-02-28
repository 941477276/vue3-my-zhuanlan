import BsSpinner from './BsSpinner.vue';

BsSpinner.install = function (vueApp: any) {
  vueApp.component(BsSpinner.name, BsSpinner);
  return vueApp;
};

export default BsSpinner;
