import BsCollapse from './BsCollapse.vue';
import BsCollapseItem from './widgets/BsCollapseItem.vue';

BsCollapse.install = function (vueApp: any) {
  vueApp.component(BsCollapse.name, BsCollapse);
  vueApp.component(BsCollapseItem.name, BsCollapseItem);
  return BsCollapse;
};

export default BsCollapse;
