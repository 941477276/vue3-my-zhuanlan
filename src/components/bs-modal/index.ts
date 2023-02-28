import BsModal from './BsModal.vue';

BsModal.install = function (vueApp: any) {
  vueApp.component(BsModal.name, BsModal);
  return BsModal;
};

export default BsModal;
