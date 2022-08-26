import { App } from 'vue';
import BsBackTop from './BsBackTop.vue';

BsBackTop.install = function (vueApp: App) {
  vueApp.component(BsBackTop.name, BsBackTop);
  return vueApp;
};

export default BsBackTop;
