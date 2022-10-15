import {
  ComponentInternalInstance,
  Ref,
  computed,
  inject
} from 'vue';
import { isUndefined } from '@/common/util';
import {
  bsMenuRootInjectKey
} from '@/ts-tokens/bootstrap/menu';

export function useMenuLevel (currentInstance: ComponentInternalInstance, props: any, id: string) {
  let menuRootCtx = inject(bsMenuRootInjectKey) as any;

  let currentKeyIndex = computed(function () {
    let keyIndex = props.keyIndex;
    if (!isUndefined(keyIndex) && keyIndex !== null && (keyIndex + '').length > 0) {
      return keyIndex;
    }
    return id;
  });

  // 获取组件层级路径
  let keyIndexPath = computed(function () {
    let parent = currentInstance.parent!;
    let path = [currentKeyIndex.value];
    while (parent && parent.type.name !== 'BsMenu') {
      path.unshift(parent.props.keyIndex as string);
      parent = parent.parent!;
    }
    return path;
  });
  // 获取组件的父级菜单组件
  let parentMenu = computed(function () {
    let parent = currentInstance.parent!;
    let names = ['BsMenu', 'BsSubMenu'];
    while (parent && !names.includes(parent.type.name as string)) {
      parent = parent.parent!;
    }
    return parent;
  });
  // 计算dom元素的padding-left值
  let paddingLeft = computed(function () {
    if (!menuRootCtx) {
      return '';
    }
    let {
      indent,
      indentUnit,
      collapse
    } = menuRootCtx.props;
    if (collapse) {
      return '';
    }
    let indentNumber = keyIndexPath.value.reduce(function (res) {
      return res + indent;
    }, 0);
    // console.log('indentNumber', indentNumber);
    /* let pl = '';
    if (indentUnit == 'px') {
      pl = indentNumber + 'px';
    } */
    // let pl = indentNumber + indentUnit;

    return {
      value: indentNumber,
      unit: indentUnit
    };
  });

  return {
    currentKeyIndex,
    keyIndexPath,
    parentMenu,
    paddingLeft
  };
};
