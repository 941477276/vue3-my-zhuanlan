import BsButton from './bs-button/BsButton.vue';
import BsInput from './bs-input/BsInput.vue';
import BsIcon from './bs-icon/BsIcon.vue';
import BsRadio from './bs-radio/BsRadio.vue';
import BsRadioGroup from './bs-radio-group/BsRadioGroup.vue';
import BsCheckbox from './bs-checkbox/BsCheckbox.vue';
import BsCheckboxGroup from './bs-checkbox-group/BsCheckboxGroup.vue';
import BsSelect from './bs-select/index';
import BsForm from '@/components/bootstrap/bs-form';
import BsDropdown from '@/components/bootstrap/bs-dropdown';
import BsPagination from '@/components/bootstrap/bs-pagination';
import BsBadge from '@/components/bootstrap/bs-badge/BsBadge.vue';
import BsMessage from '@/components/bootstrap/bs-message';
import BsBreadcrumb from '@/components/bootstrap/bs-breadcrumb';

export default function (vueApp: any) {
  vueApp.component(BsButton.name, BsButton);
  vueApp.component(BsInput.name, BsInput);
  vueApp.component(BsIcon.name, BsIcon);
  vueApp.component(BsRadio.name, BsRadio);
  vueApp.component(BsRadioGroup.name, BsRadioGroup);
  vueApp.component(BsCheckbox.name, BsCheckbox);
  vueApp.component(BsCheckboxGroup.name, BsCheckboxGroup);
  vueApp.component(BsBadge.name, BsBadge);
  // vueApp.component(BsSelect.name, BsSelect);
  vueApp.use(BsSelect);
  vueApp.use(BsForm);
  vueApp.use(BsDropdown);
  vueApp.use(BsPagination);
  vueApp.use(BsMessage);
  vueApp.use(BsBreadcrumb);
}
