import BsTabs from './BsTabs.vue';
import BsTabPane from './widgets/BsTabPane.vue';

BsTabs.install = function (vueApp: any) {
  vueApp.component(BsTabs.name, BsTabs);
  vueApp.component(BsTabPane.name, BsTabPane);
};

export default BsTabs;
