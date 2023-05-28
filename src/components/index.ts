import BsButton from './bs-button';
import BsButtonGroup from './bs-button-group';
import BsInput from './bs-input';
import BsRadio from './bs-radio';
import BsRadioGroup from './bs-radio-group';
import BsCheckbox from './bs-checkbox';
import BsCheckboxGroup from './bs-checkbox-group';
import BsSelect from './bs-select';
import BsForm from './bs-form';
import BsDropdown from './bs-dropdown';
import BsDropdownTransition from './bs-dropdown-transition';
import BsPagination from './bs-pagination';
import BsBadge from './bs-badge';
import BsMessage from './bs-message';
import BsBreadcrumb from './bs-breadcrumb';
import BsTag from './bs-tag';
import BsProgress from './bs-progress';
import BsTabs from './bs-tabs';
import BsSwitch from './bs-switch';
import BsMessageBox from './bs-message-box';
import BsAlert from './bs-alert';
import BsInputNumber from './bs-input-number';
import BsTooltip from './bs-tooltip';
import BsSlider from './bs-slider';
import BsModal from './bs-modal';
import BsDrawer from './bs-drawer';
import BsPopover from './bs-popover';
import BsSpinner from './bs-spinner';
import BsPopConfirm from './bs-pop-confirm';
import BsCollapse from './bs-collapse';
import BsCollapseTransition from './bs-collapse-transition';
import BsTree from './bs-tree';
import BsTreeSelect from './bs-tree-select';
import BsInputTags from './bs-input-tags';
import BsSelectInput from './bs-select-input';
import BsTimePicker from './bs-time-picker';
import BsDatePicker from './bs-date-picker';
import BsBackTop from './bs-backtop';
import BsLoading from './bs-loading';
import BsCascader from './bs-cascader';
import BsToast from './bs-toast';
import BsMenu from './bs-menu';
import BsConfigProvider from './bs-config-provider';
import BsRelativeTime from './bs-relative-time';
import version from '../version';

export * from './bs-message';
export * from './bs-message-box';
export * from './bs-toast';
export * from './bs-loading/loading';

export default {
  name: 'BsVue',
  version,
  install (vueApp: any) {
    vueApp.use(BsButton);
    vueApp.use(BsInput);
    vueApp.use(BsRadio);
    vueApp.use(BsRadioGroup);
    vueApp.use(BsCheckbox);
    vueApp.use(BsCheckboxGroup);
    vueApp.use(BsBadge);
    vueApp.use(BsSelect);
    vueApp.use(BsForm);
    vueApp.use(BsDropdown);
    vueApp.use(BsDropdownTransition);
    vueApp.use(BsPagination);
    vueApp.use(BsMessage);
    vueApp.use(BsBreadcrumb);
    vueApp.use(BsTag);
    vueApp.use(BsProgress);
    vueApp.use(BsTabs);
    vueApp.use(BsSwitch);
    vueApp.use(BsMessageBox);
    vueApp.use(BsAlert);
    vueApp.use(BsInputNumber);
    vueApp.use(BsTooltip);
    vueApp.use(BsSlider);
    vueApp.use(BsModal);
    vueApp.use(BsDrawer);
    vueApp.use(BsPopover);
    vueApp.use(BsSpinner);
    vueApp.use(BsPopConfirm);
    vueApp.use(BsCollapse);
    vueApp.use(BsCollapseTransition);
    vueApp.use(BsTree);
    vueApp.use(BsTreeSelect);
    vueApp.use(BsInputTags);
    vueApp.use(BsSelectInput);
    vueApp.use(BsTimePicker);
    vueApp.use(BsDatePicker);
    vueApp.use(BsBackTop);
    vueApp.use(BsLoading);
    vueApp.use(BsCascader);
    vueApp.use(BsButtonGroup);
    vueApp.use(BsToast);
    vueApp.use(BsMenu);
    vueApp.use(BsConfigProvider);
    vueApp.use(BsRelativeTime);
  }
};
