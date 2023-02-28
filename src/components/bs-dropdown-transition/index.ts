import { App } from 'vue';
import BsDropdownTransition from './BsDropdownTransition.vue';

BsDropdownTransition.install = function (vueApp: App) {
  vueApp.component(BsDropdownTransition.name, BsDropdownTransition);
  return vueApp;
};

export default BsDropdownTransition;
