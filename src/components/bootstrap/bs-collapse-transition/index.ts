import { App } from 'vue';
import BsCollapseTransition from './BsCollapseTransition.vue';

BsCollapseTransition.install = function (vueApp: App) {
  vueApp.component(BsCollapseTransition.name, BsCollapseTransition);
  return vueApp;
};

export default BsCollapseTransition;
