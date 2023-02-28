import BsProgress from './BsProgress.vue';

BsProgress.install = function (vueApp: any) {
  vueApp.component(BsProgress.name, BsProgress);
  return vueApp;
};

export default BsProgress;
