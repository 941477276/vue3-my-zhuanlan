import BsForm from './BsForm.vue';
import BsFormItem from './widgets/BsFormItem.vue';

BsForm.install = function (vueApp: any) {
  vueApp.component(BsForm.name, BsForm);
  vueApp.component(BsFormItem.name, BsFormItem);
};

export default BsForm;
