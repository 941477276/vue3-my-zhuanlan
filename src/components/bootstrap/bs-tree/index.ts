import BsTree from './BsTree.vue';

BsTree.install = function (vueApp: any) {
  vueApp.component(BsTree.name, BsTree);
  return vueApp;
};

export default BsTree;
