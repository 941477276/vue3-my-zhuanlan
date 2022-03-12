import BsButton from './bs-button/BsButton.vue';
import BsDropdown from './bs-dropdown/BsDropdown.vue';
import BsDropdownItem from './bs-dropdown-item/BsDropdownItem.vue';
import BsInput from './bs-input/BsInput.vue';
import BsIcon from './bs-icon/BsIcon.vue';

export default function (vueApp: any) {
  vueApp.component(BsButton.name, BsButton);
  vueApp.component(BsDropdown.name, BsDropdown);
  vueApp.component(BsDropdownItem.name, BsDropdownItem);
  vueApp.component(BsInput.name, BsInput);
  vueApp.component(BsIcon.name, BsIcon);
}
