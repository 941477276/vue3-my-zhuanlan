import BsBadge from './BsBadge.vue';

BsBadge.install = function (vueApp: any) {
  vueApp.component(BsBadge.name, BsBadge);
  return vueApp;
};

export default BsBadge;
