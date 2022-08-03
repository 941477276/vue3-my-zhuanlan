import BsDatePicker from './BsDatePicker.vue';

BsDatePicker.install = function (vueApp: any) {
  vueApp.component(BsDatePicker.name, BsDatePicker);
  return vueApp;
};

export default BsDatePicker;
