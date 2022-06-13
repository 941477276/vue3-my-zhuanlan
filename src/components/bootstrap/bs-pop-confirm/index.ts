import BsPopConfirm from './BsPopConfirm.vue';

BsPopConfirm.install = function (vueApp: any) {
  vueApp.component(BsPopConfirm.name, BsPopConfirm);
  return vueApp;
};

export default BsPopConfirm;
