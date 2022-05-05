import BsButton from './BsButton.vue';

BsButton.install = function (vueApp: any) {
  vueApp.component(BsButton.name, BsButton);
  return vueApp;
};

export default BsButton;
