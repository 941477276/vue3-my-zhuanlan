import BsTimePicker from './BsTimePicker.vue';

BsTimePicker.install = function (vueApp: any) {
  vueApp.component(BsTimePicker.name, BsTimePicker);
  return vueApp;
};

export default BsTimePicker;
