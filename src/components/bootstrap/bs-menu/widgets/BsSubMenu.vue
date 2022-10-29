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
      @click="handleSubmenuTitleClick"
      @mouseenter="handleSubmenuTitleMouseenter">
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
      v-if="menuRootProps.subMenuDisplayMode == 'collapse'">
      <ul
        v-show="submenuVisible"
        class="bs-submenu-content"
        :id="comId + '--content'"
        :data-submenu-path="submenuPath">
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
        :set-min-width="false"
        @vnode-mounted="onDropdownTransitionMounted">
        <ul
          v-show="submenuVisible"
          class="bs-submenu-content"
          :id="comId + '--content'"
          :data-submenu-path="submenuPath"
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
  Ref,
  defineComponent,
  getCurrentInstance,
  computed,
  ref,
  inject,
  nextTick,
  toRef,
  onMounted,
  onUnmounted
} from 'vue';
import BsIcon from '../../bs-icon/BsIcon.vue';
import BsDropdownTransition from '../../bs-dropdown-transition/BsDropdownTransition.vue';
import BsCollapseTransition from '../../bs-collapse-transition/BsCollapseTransition.vue';
import { useMenuLevel } from '../hooks/useMenuLevel';
import { useGlobalEvent } from '@/hooks/useGlobalEvent';
import {
  bsMenuRootInjectKey,
  bsSubMenuDisplayMode
} from '@/ts-tokens/bootstrap/menu';
import {
  util,
  isUndefined
} from '@/common/util';

let subMenuCount = 0;
let componentName = 'BsSubMenu';
export default defineComponent({
  name: componentName,
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
    let currentSubMenuCount = ++subMenuCount;
    let subMenuId = `bs-submenu_${currentSubMenuCount}`;
    let bsSubmenuTitleRef = ref<HTMLElement | null>(null);
    let menuRootCtx = inject(bsMenuRootInjectKey) as any;

    // 获取当前组件的父级菜单组件，层级路径，层级ID
    let {
      currentKeyIndex,
      keyIndexPath,
      parentMenu,
      parentsIdPath,
      paddingLeft
    } = useMenuLevel(currentIns, props, subMenuId);

    // 根菜单的属性
    let menuRootProps = computed(function () {
      let subMenuDisplayModeInner = menuRootCtx?.subMenuDisplayModeInner.value || bsSubMenuDisplayMode.collapse;
      let rootProps = menuRootCtx?.props;
      let mode = rootProps?.mode;
      let triggerType = rootProps?.subMenuTrigger;
      let collapsed = rootProps?.collapse; // 根菜单是否收缩起来了
      if (!triggerType) {
        if (collapsed || mode == 'vertical' || mode == 'horizontal') {
          triggerType = 'hover';
        } else {
          triggerType = 'click';
        }
      }
      return {
        subMenuDisplayMode: subMenuDisplayModeInner,
        triggerType,
        collapsed,
        mode: rootProps?.mode
      };
    });

    // 当前submenu的路径，当子菜单展现形式为下拉时用来匹配是否为当前submenu的内容
    let submenuPath = computed(function () {
      let parent = parentMenu.value;
      if (!parent || parent.type.name == 'BsMenu') {
        return currentSubMenuCount + '';
      }
      let parentSubmenuPath = (parent.proxy as any)?.submenuPath || '';
      return parentSubmenuPath + '__' + currentSubMenuCount;
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

      menuRootCtx.expandedSubMenu(subMenuId, flag);
      let triggerType = menuRootProps.value.triggerType;
      if (flag) {
        // console.log('menuRootProps.value.triggerType', menuRootProps.value.triggerType);
        if (triggerType === 'hover') {
          useGlobalEvent.addEvent('document', 'mousemove', handleMouseleave);
        } else if (triggerType === 'click') {
          console.log('给document绑定click事件', subMenuId);
          useGlobalEvent.addEvent('document', 'click', handleDocumentClick);
        }
      } else {
        useGlobalEvent.removeEvent('document', 'mousemove', handleMouseleave);
        useGlobalEvent.removeEvent('document', 'click', handleDocumentClick);
      }

      if (flag && !submenuRendered.value) {
        submenuRendered.value = true;
        /* let timer = setTimeout(function () {
          clearTimeout(timer);
          submenuVisible.value = flag as boolean;
        }, 160); */
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

    let mouseenterTimer = 0;
    let handleSubmenuTitleMouseenter = function () {
      let menuRootPropsValue = menuRootProps.value;
      if (props.disabled || submenuVisible.value || menuRootPropsValue.triggerType != 'hover') {
        return;
      }
      clearTimeout(mouseenterTimer);
      mouseenterTimer = setTimeout(function () {
        clearTimeout(mouseenterTimer);
        expandSubmenu(true);
      }, 150);
    };

    // 判断子菜单是否应该隐藏
    let isChildrenShouldHide = function (target: HTMLElement | undefined) {
      if (!target) {
        return true;
      }
      let bsSubmenuTitleEle = bsSubmenuTitleRef.value;
      let submenuPathVale = submenuPath.value;
      // console.log('handleMouseleave', target, util.elementContains(bsSubmenuTitleEle, target));
      // 如果鼠标是在当前submenu的标题上，则不处理任何事情
      if (target === bsSubmenuTitleEle || util.elementContains(bsSubmenuTitleEle, target)) {
        return false;
      }
      // 获取子下拉菜单的根元素
      let childSubmenuDropdownRootEl = util.parents(target, 'bs-submenu-content');
      // console.log('childSubmenuDropdownRootEl', childSubmenuDropdownRootEl);
      if (childSubmenuDropdownRootEl) {
        let childSubmenuPath = childSubmenuDropdownRootEl.dataset.submenuPath || '';
        // 鼠标在子下拉菜单中
        if (childSubmenuPath.startsWith(submenuPathVale)) {
          return false;
        }
      }
      return true;
    };

    let mouseleavetimer = 0;
    let handleMouseleave = function (evt: MouseEvent) {
      let now = new Date().getTime();
      if (mouseleavetimer > 0 && (now - mouseleavetimer) < 150) {
        return;
      }
      if (props.disabled || !submenuVisible.value || menuRootProps.value.triggerType != 'hover') {
        return;
      }
      mouseleavetimer = now;
      let target = evt.target as HTMLElement;
      if (isChildrenShouldHide(target)) {
        expandSubmenu(false);
      }
    };

    let handleDocumentClick = function (evt: MouseEvent) {
      let menuRootPropsValue = menuRootProps.value;
      if (props.disabled || menuRootPropsValue.triggerType != 'click' || menuRootPropsValue.subMenuDisplayMode != 'dropdown') {
        return;
      }
      let target = evt.target as HTMLElement;
      console.log('isChildrenShouldHide(target)', isChildrenShouldHide(target), target);
      if (isChildrenShouldHide(target)) {
        expandSubmenu(false);
      }
    };

    // 下拉过渡组件mounted事件(监听子组件生命周期)
    let onDropdownTransitionMounted = function (a: any) {
      console.log('onDropdownTransitionMounted', a);
      nextTick(function () {
        submenuVisible.value = true;
      });
    };

    menuRootCtx?.addSubMenu({
      keyIndex: currentKeyIndex.value,
      id: subMenuId,
      name: componentName,
      parentsIdPath: parentsIdPath,
      disabled: toRef(props, 'disabled') as Ref<boolean>,
      // parentMenuId: string;
      expandSubmenu
    });

    onUnmounted(function () {
      menuRootCtx?.removeSubMenu(subMenuId);
      useGlobalEvent.removeEvent('document', 'mousemove', handleMouseleave);
      useGlobalEvent.removeEvent('document', 'click', handleDocumentClick);
    });
    return {
      comId: subMenuId,
      subMenuCount: currentSubMenuCount,
      currentKeyIndex,
      keyIndexPath,
      paddingLeft,
      menuRootProps,
      submenuVisible,
      submenuRendered,
      bsSubmenuTitleRef,
      submenuPath,

      expandSubmenu,
      handleSubmenuTitleClick,
      handleSubmenuTitleMouseenter,
      onDropdownTransitionMounted
    };
  }
});
</script>
