import BsIcon from './BsIcon.vue';

BsIcon.install = function (vueApp: any) {
  vueApp.component(BsIcon.name, BsIcon);
  return vueApp;
};

export default BsIcon;
