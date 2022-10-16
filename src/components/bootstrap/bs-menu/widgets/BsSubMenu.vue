<template>
  <li
    class="bs-submenu"
    :class="{
      'bs-submenu-expanded': submenuVisible,
      'bs-submenu-display-with-dropdown': menuRootProps.subMenuDisplayMode == 'dropdown'
    }"
    role="menu"
    :aria-expanded="submenuVisible"
    :aria-disabled="disabled"
    :aria-level="keyIndexPath.length">
    <div
      ref="bsSubmenuTitleRef"
      class="bs-submenu-title"
      :class="{
        'has-icon': icon || $slots.icon
      }"
      :style="{
        paddingLeft: paddingLeft.value ? (paddingLeft.value + paddingLeft.unit): ''
      }"
      @click="handleSubmenuTitleClick">
      <span
        v-if="icon || $slots.icon"
        class="bs-menu-item-icon"
        role="img">
        <slot name="icon">
          <BsIcon :name="icon"></BsIcon>
        </slot>
      </span>
      <div class="bs-submenu-title-content">
        <slot name="title">{{ title }}</slot>
      </div>
      <span class="bs-submenu-arrow">
        <slot name="arrow">
          <BsIcon class="bs-submenu-arrow-icon" name="chevron-down"></BsIcon>
        </slot>
      </span>
    </div>
    <BsCollapseTransition
      v-if="menuRootProps.subMenuDisplayMode == 'collapse' && submenuRendered">
      <ul
        v-show="submenuVisible"
        class="bs-submenu-content">
        <slot></slot>
      </ul>
    </BsCollapseTransition>
    <teleport
      to="body"
      v-else-if="menuRootProps.subMenuDisplayMode == 'dropdown'">
      <BsDropdownTransition
        v-if="submenuRendered"
        placement="right"
        :reference-ref="bsSubmenuTitleRef"
        :try-all-placement="false"
        :set-width="menuRootProps.mode == 'horizontal'"
        :set-min-width="false">
        <ul
          v-show="submenuVisible"
          class="bs-submenu-content"
          :class="{
            'bs-submenu-content-dropdown': menuRootProps.subMenuDisplayMode == 'dropdown'
          }">
          <slot></slot>
        </ul>
      </BsDropdownTransition>
    </teleport>
  </li>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  computed,
  ref,
  inject,
  nextTick
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import BsDropdownTransition from '../../bs-dropdown-transition/BsDropdownTransition.vue';
import BsCollapseTransition from '../../bs-collapse-transition/BsCollapseTransition.vue';
import { useMenuLevel } from '../hooks/useMenuLevel';
import {
  bsMenuRootInjectKey,
  bsSubMenuDisplayMode
} from '@/ts-tokens/bootstrap/menu';
import {
  isUndefined
} from '@/common/util';

let subMenuCount = 0;
export default defineComponent({
  name: 'BsSubMenu',
  components: {
    BsIcon,
    BsCollapseTransition,
    BsDropdownTransition
  },
  props: {
    keyIndex: { // 唯一标识，必填
      type: String,
      default: '',
      required: true
    },
    title: { // 标题
      type: String,
      default: ''
    },
    icon: { // 图标名称
      type: String,
      default: ''
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup (props: any, ctx: any) {
    let currentIns = getCurrentInstance()!;
    let subMenuId = `bs-submenu_${++subMenuCount}`;
    let bsSubmenuTitleRef = ref<HTMLElement | null>(null);
    let menuRootCtx = inject(bsMenuRootInjectKey) as any;

    // 获取当前组件的父级菜单组件，层级路径，层级ID
    let {
      currentKeyIndex,
      keyIndexPath,
      parentMenu,
      paddingLeft
    } = useMenuLevel(currentIns, props, subMenuId);

    let menuRootProps = computed(function () {
      let subMenuDisplayModeInner = menuRootCtx?.subMenuDisplayModeInner.value || bsSubMenuDisplayMode.collapse;
      let rootProps = menuRootCtx?.props;
      let triggerType = rootProps?.subMenuTrigger || 'click';
      let collapsed = rootProps?.collapse; // 根菜单是否收缩起来了
      return {
        subMenuDisplayMode: subMenuDisplayModeInner,
        triggerType,
        collapsed,
        mode: rootProps?.mode
      };
    });

    // 子菜单是否显示
    let submenuVisible = ref(false);
    let submenuRendered = ref(false);
    // 显示/隐藏子菜单
    let expandSubmenu = function (flag?: boolean) {
      if (props.disabled) {
        return;
      }
      if (isUndefined(flag)) {
        flag = !submenuVisible.value;
      } else {
        flag = !!flag;
      }
      if (flag && !submenuRendered.value) {
        submenuRendered.value = true;
        let timer = setTimeout(function () {
          clearTimeout(timer);
          submenuVisible.value = flag as boolean;
        }, 100);
      } else {
        nextTick(function () {
          submenuVisible.value = flag as boolean;
        });
      }
    };
    let handleSubmenuTitleClick = function () {
      let menuRootPropsValue = menuRootProps.value;
      if (props.disabled || menuRootPropsValue.triggerType != 'click') {
        return;
      }
      expandSubmenu();
    };

    return {
      currentKeyIndex,
      keyIndexPath,
      paddingLeft,
      menuRootProps,
      submenuVisible,
      submenuRendered,
      bsSubmenuTitleRef,

      expandSubmenu,
      handleSubmenuTitleClick
    };
  }
});
</script>
