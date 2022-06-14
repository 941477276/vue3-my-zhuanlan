/**
 * 元素折叠过度动效
 */
export function useCollapseTransition () {
  let oldPaddingTop = '';
  let oldPaddingBottom = '';
  // let oldOpacity = '';
  // let oldMaxHeight = '';
  let oldOverflow = '';

  return {
    collapseBeforeEnter (el: HTMLElement) {
      // console.log('11, collapseBeforeEnter');
      oldPaddingBottom = el.style.paddingBottom;
      oldPaddingTop = el.style.paddingTop;

      el.style.paddingTop = '0';
      el.style.paddingBottom = '0';
      el.style.maxHeight = '0';
    },
    collapseEnter (el: HTMLElement, done: () => void) {
      // console.log('22, collapseEnter');

      oldOverflow = el.style.overflow;
      let elHeight = el.scrollHeight;
      if (elHeight > 0) {
        el.style.maxHeight = elHeight + 'px';
      } else {
        el.style.maxHeight = '0';
      }
      el.style.paddingTop = oldPaddingTop;
      el.style.paddingBottom = oldPaddingBottom;

      el.style.overflow = 'hidden';
      // done();
      let onTransitionDone = function () {
        done();
        // console.log('enter onTransitionDone');
        el.removeEventListener('transitionend', onTransitionDone, false);
        el.removeEventListener('transitioncancel', onTransitionDone, false);
      };
      // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
      el.addEventListener('transitionend', onTransitionDone, false);
      el.addEventListener('transitioncancel', onTransitionDone, false);
    },
    collapseAfterEnter (el: HTMLElement) {
      // console.log('33, collapseAfterEnter');

      el.style.maxHeight = '';
      el.style.overflow = oldOverflow;
    },

    collapseBeforeLeave (el: HTMLElement) {
      // console.log('44, collapseBeforeLeave', el.scrollHeight);

      oldPaddingBottom = el.style.paddingBottom;
      oldPaddingTop = el.style.paddingTop;
      oldOverflow = el.style.overflow;

      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
    },
    collapseLeave (el: HTMLElement, done: () => void) {
      // console.log('55, collapseLeave', el.scrollHeight);

      if (el.scrollHeight !== 0) {
        el.style.maxHeight = '0';
        el.style.paddingBottom = '0';
        el.style.paddingTop = '0';
      }
      // done();
      let onTransitionDone = function () {
        done();
        // console.log('leave onTransitionDone');
        el.removeEventListener('transitionend', onTransitionDone, false);
        el.removeEventListener('transitioncancel', onTransitionDone, false);
      };
      // 绑定元素的transition完成事件，在transition完成后立即完成vue的过度动效
      el.addEventListener('transitionend', onTransitionDone, false);
      el.addEventListener('transitioncancel', onTransitionDone, false);
    },
    collapseAfterLeave (el: HTMLElement) {
      // console.log('66, collapseAfterLeave');
      el.style.maxHeight = '';
      el.style.overflow = oldOverflow;
      el.style.paddingBottom = oldPaddingBottom;
      el.style.paddingTop = oldPaddingTop;

      oldOverflow = oldPaddingBottom = oldPaddingTop = '';
    }
  };
};
