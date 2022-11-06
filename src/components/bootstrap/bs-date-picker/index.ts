import BsDatePicker from './BsDatePicker';

BsDatePicker.install = function (vueApp: any) {
  vueApp.component(BsDatePicker.name, BsDatePicker);
  return vueApp;
};

export default BsDatePicker;
