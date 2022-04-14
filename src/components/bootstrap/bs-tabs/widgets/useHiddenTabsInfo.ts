import {
  ref,
  watch,
  Ref,
  onMounted,
  onUnmounted
} from 'vue';
import { util } from '@/common/util';
import {
  HiddenTabInfo
} from '@/ts-tokens/bootstrap/tabs';

function getHiddenTabs (navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>, tabPosition: string) {
  let result = {
    hiddenTabs: [] as Array<HiddenTabInfo>,
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
    // console.log('tabsNavWidth', tabsNavWidth, navScrollerWidth);
    // console.log('navScrollerOffset', navScrollerOffset);
    result.isOverflow = tabsNavWidth > navScrollerWidth;
    // 只有在标签列表有溢出的时候才会有隐藏的标签页
    if (result.isOverflow) {
      let offsetRight = navScrollerOffset.left + navScrollerWidth;
      // console.log('paddingRight', paddingRight);
      let hiddenTabs = ([]).slice.call(tabsNavEl.querySelectorAll('.bs-tabs-nav-item')).filter(function (navItem: HTMLElement) {
        let offset = util.offset(navItem);
        let elOffsetRight = offset.left + navItem.offsetWidth;
        // 元素的左侧在视图中
        let offsetStartInView = offset.left >= navScrollerOffset.left && offset.left < offsetRight;
        let offsetEndInView = elOffsetRight > navScrollerOffset.left && elOffsetRight < offsetRight;
        // console.log('offsetStartInView', offsetStartInView, offsetEndInView);
        return !offsetStartInView && !offsetEndInView;
      });
      console.log('hiddenTabs', hiddenTabs);
      result.hiddenTabs = hiddenTabs.map((ele: HTMLElement) => {
        return {
          id: ele.getAttribute('data-tabs-nav-item-id') as string,
          disabled: util.hasClass(ele, 'is-disabled')
        };
      });
    }
  } else {
    result.isOverflow = tabsNavEl.offsetHeight > navScrollerEl.offsetHeight;
    // console.log('navScrollerEl.offsetHeight', navScrollerEl.offsetHeight, tabsNavEl.offsetHeight);
    if (result.isOverflow) {
      let offsetBottom = navScrollerOffset.top + navScrollerEl.offsetHeight;
      let hiddenTabs = ([]).slice.call(tabsNavEl.querySelectorAll('.bs-tabs-nav-item')).filter(function (navItem: HTMLElement) {
        let offset = util.offset(navItem);
        let elOffsetBottom = offset.top + navItem.offsetHeight;
        // 元素的顶部在视图中
        let offsetStartInView = offset.top >= navScrollerOffset.top && offset.top < offsetBottom;
        let offsetEndInView = elOffsetBottom > navScrollerOffset.top && elOffsetBottom < offsetBottom;

        return !offsetStartInView && !offsetEndInView;
      });
      console.log('hiddenTabs', hiddenTabs);
      result.hiddenTabs = hiddenTabs.map((ele: HTMLElement) => {
        return {
          id: ele.getAttribute('data-tabs-nav-item-id') as string,
          disabled: util.hasClass(ele, 'is-disabled')
        };
      });
    }
  }

  return result;
};

export function useHiddenTabsInfo (props: any, navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>) {
  // 隐藏的tab项的数量
  let hiddenTabsCount = ref(0);
  // 标签列表是否溢出了
  let isOverflow = ref(false);
  let hiddenTabs = ref<HiddenTabInfo[]>([]);

  let calcHiddenTabInfo = function () {
    let hiddenTabsInfo = getHiddenTabs(navScrollerRef, tabsNavRef, props.tabPosition);
    // console.log('hiddenTabsInfo', hiddenTabsInfo);
    hiddenTabsCount.value = hiddenTabsInfo.hiddenTabs.length;
    isOverflow.value = hiddenTabsInfo.isOverflow;
    hiddenTabs.value = hiddenTabsInfo.hiddenTabs;
  };

  let stopWatch = watch(() => props.panes, function () {
    calcHiddenTabInfo();
  });
  onMounted(function () {
    calcHiddenTabInfo();
  });
  onUnmounted(function () {
    stopWatch();
  });

  return {
    hiddenTabsCount,
    isOverflow,
    hiddenTabs
  };
};
