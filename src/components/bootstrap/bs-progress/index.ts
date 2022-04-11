import BsProgress from './BsProgress.vue';

BsProgress.install = function (vueApp: any) {
  vueApp.component(BsProgress.name, BsProgress);
};

export default BsProgress;
