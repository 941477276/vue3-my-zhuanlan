import {
  ref,
  onUpdated,
  watch,
  Ref,
  onMounted
} from 'vue';
import { util } from '@/common/util';

function getHiddenTabs (navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>, tabPosition: string) {
  let result = {
    hiddenTabsCount: 0,
    isOverflow: false // 标签列表是否有溢出
  };
  let navScrollerEl = navScrollerRef.value;
  let tabsNavEl = tabsNavRef.value;
  if (!navScrollerEl || !tabsNavEl) {
    return result;
  }
  let navScrollerOffset = util.offset(navScrollerEl);
  if (tabPosition === 'top' || tabPosition === 'bottom') {
    let navScrollerWidth = navScrollerEl.offsetWidth;
    let tabsNavWidth = tabsNavEl.offsetWidth;
    console.log('tabsNavWidth', tabsNavWidth, navScrollerWidth);
    console.log('navScrollerOffset', navScrollerOffset);
    result.isOverflow = tabsNavWidth > navScrollerWidth;
    // 只有在标签列表有溢出的时候才会有隐藏的标签页
    if (result.isOverflow) {
      let offsetRight = navScrollerOffset.left + navScrollerWidth;
      // let paddingLeft = util.getStyle(navScrollerEl, 'padding-left');
      // let paddingRight = util.getStyle(navScrollerEl, 'padding-right');
      // console.log('paddingRight', paddingRight);
      let hiddenTabs = ([]).slice.call(tabsNavEl.querySelector('.bs-tabs-nav-item')).filter(function (navItem: HTMLElement) {
        let offset = util.offset(navItem);
        let elOffsetRight = offset.left + navItem.offsetWidth;
        // 元素的左侧在视图中
        let offsetStartInView = offset.left >= navScrollerOffset.left && offset.left < offsetRight;
        let offsetEndInView = elOffsetRight > navScrollerOffset.left && elOffsetRight < offsetRight;
        // return
      });
    }
  } else {
    result.isOverflow = tabsNavEl.offsetHeight > navScrollerEl.offsetHeight;
  }

  return result;
};

export function useHiddenTabsInfo (props: any, navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>) {
  // 隐藏的tab项的数量
  let hiddenTabsCount = ref(0);
  // 是否有隐藏的tabs
  let hasHiddenTabs = ref(false);

  /* watch(() => props.panes, function () {
    let hiddenTabsIfno = getHiddenTabs(navScrollerRef, tabsNavRef);
    console.log('hiddenTabsIfno', hiddenTabsIfno);
  }, { immediate: true }); */
  onMounted(function () {
    let hiddenTabsIfno = getHiddenTabs(navScrollerRef, tabsNavRef, props.tabPosition);
    console.log('hiddenTabsIfno', hiddenTabsIfno);
  });

  return {
    hiddenTabsCount
  };
};
