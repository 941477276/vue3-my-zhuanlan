import BsDrawer from './BsDrawer.vue';

BsDrawer.install = function (vueApp: any) {
  vueApp.component(BsDrawer.name, BsDrawer);
  return BsDrawer;
};

export default BsDrawer;
