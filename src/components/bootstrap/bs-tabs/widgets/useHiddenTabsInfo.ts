import {
  ref,
  watch,
  Ref,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue';
import { util } from '@/common/util';
import {
  HiddenTabInfo
} from '@/ts-tokens/bootstrap/tabs';

function getHiddenTabs (navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>, tabPosition: string) {
  let result = {
    hiddenTabs: [] as Array<HiddenTabInfo>, // 所有隐藏的标签导航
    leftHiddenTabs: [] as Array<HiddenTabInfo>, // 左边隐藏的标签导航
    rightHiddenTabs: [] as Array<HiddenTabInfo>, // 右边隐藏的标签导航
    // topHiddenTabs: [] as Array<HiddenTabInfo>,
    // bottomHiddenTabs: [] as Array<HiddenTabInfo>,
    isOverflow: false // 标签列表是否有溢出
  };
  let navScrollerEl = navScrollerRef.value;
  let tabsNavEl = tabsNavRef.value;
  if (!navScrollerEl || !tabsNavEl) {
    return result;
  }
  let navScrollerOffset = util.offset(navScrollerEl);
  let convertHiddenTabs = (ele: HTMLElement) => {
    return {
      id: ele.getAttribute('data-tabs-nav-item-id') as string,
      disabled: util.hasClass(ele, 'is-disabled')
    };
  };
  if (tabPosition === 'top' || tabPosition === 'bottom') {
    let navScrollerWidth = navScrollerEl.offsetWidth;
    let tabsNavWidth = tabsNavEl.offsetWidth;
    // console.log('tabsNavWidth', tabsNavWidth, navScrollerWidth);
    // console.log('navScrollerOffset', navScrollerOffset);
    result.isOverflow = tabsNavWidth > navScrollerWidth;
    // 只有在标签列表有溢出的时候才会有隐藏的标签页
    if (result.isOverflow) {
      let offsetRight = navScrollerOffset.left + navScrollerWidth;
      let tabsNavTranslateValue = util.getEleTranslateValue(util.getStyle(tabsNavEl, 'transform')) as {x: number; y: number; z: number; rotate: number};
      // console.log('tabsNavTranslateX', tabsNavTranslateValue);
      let leftHiddenTabs: HTMLElement[] = [];
      let rightHiddenTabs: HTMLElement[] = [];
      let hiddenTabs = ([]).slice.call(tabsNavEl.querySelectorAll('.bs-tabs-nav-item')).filter(function (navItem: HTMLElement) {
        let offset = util.offset(navItem);
        // 标签导航的offsetLeft需要加上 .bs-tabs-nav 位移的距离
        offset.left = offset.left + tabsNavTranslateValue.x;
        let elOffsetRight = offset.left + navItem.offsetWidth;
        // 元素的左侧在视图中
        let offsetStartInView = offset.left >= navScrollerOffset.left && offset.left < offsetRight;
        let offsetEndInView = elOffsetRight > navScrollerOffset.left && elOffsetRight < offsetRight;
        let isFullHidden = !offsetStartInView && !offsetEndInView; // 是否完全隐藏
        // console.log('offsetStartInView', offsetStartInView, offsetEndInView);

        // console.log('offset.left', offset.left, navItem.offsetLeft);
        if (isFullHidden) {
          // console.log('elOffsetRight', elOffsetRight);
          if (elOffsetRight <= navScrollerOffset.left) {
            leftHiddenTabs.push(navItem);
          } else if (offset.left >= offsetRight) {
            rightHiddenTabs.push(navItem);
          }
        }

        return isFullHidden;
      });
      // console.log('leftHiddenTabs', leftHiddenTabs);
      // console.log('rightHiddenTabs', rightHiddenTabs);
      // console.log('hiddenTabs', hiddenTabs);
      // console.log('-----------------');

      result.hiddenTabs = hiddenTabs.map(convertHiddenTabs);
      result.leftHiddenTabs = leftHiddenTabs.map(convertHiddenTabs);
      result.rightHiddenTabs = rightHiddenTabs.map(convertHiddenTabs);
    }
  } else {
    result.isOverflow = tabsNavEl.offsetHeight > navScrollerEl.offsetHeight;
    // console.log('navScrollerEl.offsetHeight', navScrollerEl.offsetHeight, tabsNavEl.offsetHeight);
    if (result.isOverflow) {
      let offsetBottom = navScrollerOffset.top + navScrollerEl.offsetHeight;
      let tabsNavTranslateValue = util.getEleTranslateValue(util.getStyle(tabsNavEl, 'transform')) as {x: number; y: number; z: number; rotate: number};
      let topHiddenTabs: HTMLElement[] = [];
      let bottomHiddenTabs: HTMLElement[] = [];
      let hiddenTabs = ([]).slice.call(tabsNavEl.querySelectorAll('.bs-tabs-nav-item')).filter(function (navItem: HTMLElement) {
        let offset = util.offset(navItem);
        // 标签导航的offsetTop需要加上 .bs-tabs-nav 位移的距离
        offset.top = offset.top + tabsNavTranslateValue.x;
        let elOffsetBottom = offset.top + navItem.offsetHeight;
        // 元素的顶部在视图中
        let offsetStartInView = offset.top >= navScrollerOffset.top && offset.top < offsetBottom;
        let offsetEndInView = elOffsetBottom > navScrollerOffset.top && elOffsetBottom < offsetBottom;
        let isFullHidden = !offsetStartInView && !offsetEndInView; // 是否完全隐藏

        if (isFullHidden) {
          // console.log('elOffsetRight', elOffsetRight);
          if (elOffsetBottom <= navScrollerOffset.top) {
            topHiddenTabs.push(navItem);
          } else if (offset.top >= offsetBottom) {
            bottomHiddenTabs.push(navItem);
          }
        }

        return isFullHidden;
      });
      // console.log('hiddenTabs', hiddenTabs);
      result.hiddenTabs = hiddenTabs.map(convertHiddenTabs);
      result.leftHiddenTabs = topHiddenTabs.map(convertHiddenTabs);
      result.rightHiddenTabs = bottomHiddenTabs.map(convertHiddenTabs);
    }
  }

  return result;
};

export function useHiddenTabsInfo (props: any, activeTabId: Ref<string>, navScrollerRef: Ref<HTMLElement|null>, tabsNavRef: Ref<HTMLElement|null>) {
  // 隐藏的tab项的数量
  let hiddenTabsCount = ref(0);
  // 标签列表是否溢出了
  let isOverflow = ref(false);
  let hiddenTabs = ref<HiddenTabInfo[]>([]);
  let leftHiddenTabs = ref<HiddenTabInfo[]>([]);
  let rightHiddenTabs = ref<HiddenTabInfo[]>([]);
  // let topHiddenTabs = ref<HiddenTabInfo[]>([]);
  // let bottomHiddenTabs = ref<HiddenTabInfo[]>([]);

  let calcHiddenTabInfo = function () {
    let hiddenTabsInfo = getHiddenTabs(navScrollerRef, tabsNavRef, props.tabPosition);
    console.log('hiddenTabsInfo', hiddenTabsInfo);
    hiddenTabsCount.value = hiddenTabsInfo.hiddenTabs.length;
    isOverflow.value = hiddenTabsInfo.isOverflow;
    hiddenTabs.value = hiddenTabsInfo.hiddenTabs;
    leftHiddenTabs.value = hiddenTabsInfo.leftHiddenTabs;
    rightHiddenTabs.value = hiddenTabsInfo.rightHiddenTabs;
  };

  let stopWatch = watch([() => props.panes, activeTabId], function () {
    let timer = setTimeout(function () {
      clearTimeout(timer);
      calcHiddenTabInfo();
    }, 310);
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
    hiddenTabs,
    leftHiddenTabs,
    rightHiddenTabs
  };
};
