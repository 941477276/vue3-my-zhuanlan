import { App } from 'vue';
import BsRelativeTime from './BsRelativeTime.vue';

BsRelativeTime.install = function (vueApp: App) {
  vueApp.component(BsRelativeTime.name, BsRelativeTime);
  return vueApp;
};

export default BsRelativeTime;
