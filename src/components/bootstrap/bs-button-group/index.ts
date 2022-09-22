import {
  App
} from 'vue';
import { BsButtonGroup } from './BsButtonGroup';

(BsButtonGroup as any).install = function (vueApp: App) {
  vueApp.component('BsButtonGroup', BsButtonGroup);
  return vueApp;
};

export default BsButtonGroup;
