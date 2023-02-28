import BsTreeSelect from './BsTreeSelect.vue';

BsTreeSelect.install = function (vueApp: any) {
  vueApp.component(BsTreeSelect.name, BsTreeSelect);
  return vueApp;
};

export default BsTreeSelect;
