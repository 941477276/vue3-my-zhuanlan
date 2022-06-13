import BsCollapse from './BsCollapse.vue';

BsCollapse.install = function (vueApp: any) {
  vueApp.component(BsCollapse.name, BsCollapse);
  return BsCollapse;
};

export default BsCollapse;
