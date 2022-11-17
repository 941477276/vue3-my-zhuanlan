import {
  App
} from 'vue';
import BsDatePicker from './BsDatePicker';

BsDatePicker.install = function (vueApp: App) {
  vueApp.component(BsDatePicker.name, BsDatePicker);
  return vueApp;
};

export default BsDatePicker;
