import BsPagination from './BsPagination.vue';

BsPagination.install = function (vueApp: any) {
  vueApp.component(BsPagination.name, BsPagination);
  return vueApp;
};

export default BsPagination;
