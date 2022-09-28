import {
  App
} from 'vue';
import BsMenu from './BsMenu.vue';
import BsSubMenu from './widgets/BsSubMenu.vue';
import BsMenuItemGroup from './widgets/BsMenuItemGroup.vue';
import BsMenuItem from './widgets/BsMenuItem.vue';

BsMenu.install = function (vueApp: App) {
  vueApp.component(BsMenu.name, BsMenu);
  vueApp.component(BsSubMenu.name, BsSubMenu);
  vueApp.component(BsMenuItemGroup.name, BsMenuItemGroup);
  vueApp.component(BsMenuItem.name, BsMenuItem);
  return vueApp;
};

export default BsMenu;
