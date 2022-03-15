import BsButton from './bs-button/BsButton.vue';
import BsDropdown from './bs-dropdown/BsDropdown.vue';
import BsDropdownItem from './bs-dropdown-item/BsDropdownItem.vue';
import BsInput from './bs-input/BsInput.vue';
import BsIcon from './bs-icon/BsIcon.vue';
import BsRadio from './bs-radio/BsRadio.vue';
import BsRadioGroup from './bs-radio-group/BsRadioGroup.vue';
import BsCheckbox from './bs-checkbox/BsCheckbox.vue';
import BsCheckboxGroup from './bs-checkbox-group/BsCheckboxGroup.vue';

export default function (vueApp: any) {
  vueApp.component(BsButton.name, BsButton);
  vueApp.component(BsDropdown.name, BsDropdown);
  vueApp.component(BsDropdownItem.name, BsDropdownItem);
  vueApp.component(BsInput.name, BsInput);
  vueApp.component(BsIcon.name, BsIcon);
  vueApp.component(BsRadio.name, BsRadio);
  vueApp.component(BsRadioGroup.name, BsRadioGroup);
  vueApp.component(BsCheckbox.name, BsCheckbox);
  vueApp.component(BsCheckboxGroup.name, BsCheckboxGroup);
}
