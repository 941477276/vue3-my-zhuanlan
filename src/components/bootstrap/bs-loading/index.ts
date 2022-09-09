import {
  App
} from 'vue';
import { BsLoading } from './loading';
import { bsLoadingDirective } from './directive';

export default {
  install (vueApp: App) {
    vueApp.directive('bsloading', bsLoadingDirective);
    return vueApp;
  }
};
export { BsLoading };
