import {
  offset,
  eleIsInFixedParents,
  getStyle,
  scrollTop,
  scrollLeft,
  getScrollParent,
  getEleTranslateValue,
  hasScroll,
  eleIsInScrollParentView,
  getDocumentWidthHeight,
  scrollWidth,
  kebabCase2CamelCase,
  checkTerminal
} from '../../utils/bs-util';

let documentNodeNames = ['HTML', 'BODY'];

export interface DropdownOffset {
  top?: number;
  left?: number;
  // bottom?: number;
  // right?: number;
}

/**
 * 计算绝对定位元素能完全出现在视口的展示方位
 * @param referenceEl 参照元素
 * @param targetEl 目标元素
 * @param direction 默认方向，支持top、bottom、left、right
 * @param tryAllDirection 当切换到direction对应的反方向目标元素也不能完全出现在视口时是否尝试切换其他方向
 * @param tryEndDirection 是否尝试切换当前方向的尾部方向
 * @param dropdownOffset 下拉菜单距参照元素的偏移量
 */
const endReg = /(\w+)End$/;
export function getDropdownDirection (referenceEl: HTMLElement, targetEl: HTMLElement, direction: string, tryAllDirection = false, tryEndDirection = true, dropdownOffset?: DropdownOffset) {
  if (!referenceEl || !targetEl || !direction) {
    throw new Error('缺少referenceEl, targetEl, direction其中的某个参数');
  }
  direction = kebabCase2CamelCase(direction);
  let defaultDirection = direction;
  let defaultDirectionIsEnd = false;
  if (endReg.test(direction)) {
    direction = RegExp.$1;
    defaultDirectionIsEnd = true;
  }
  let scrollInfo = {
    top: scrollTop(),
    left: scrollLeft()
  };
  // console.log('targetElOffsetParentOffset', targetElOffsetParentOffset);
  var referenceOffset = offset(referenceEl);
  // console.log('targetElOffsetParent', targetElOffsetParent, referenceOffset);
  // 判断参照元素是否在position: fixed的元素中
  var referenceIsInFixedPosition = eleIsInFixedParents(referenceEl);
  // console.log('referenceOffset原始的', { ...referenceOffset });
  var referenceRect = referenceEl.getBoundingClientRect();
  var styleDisplay = targetEl.style.display;
  var styleOpacity = targetEl.style.opacity;
  var targetElDisplay = getStyle(targetEl, 'display');
  var targetElIsFixed = getStyle(targetEl, 'position') === 'fixed';
  if (targetElDisplay === 'none') {
    targetEl.style.opacity = '0';
    targetEl.style.display = 'block';
  }
  var needSubtractScrollOffset = true; // 判断元素是否处于滚动容器视口时是否需要减去浏览器滚动条滚动的距离
  let targetElOffsetParent = (targetEl.offsetParent || document.body) as HTMLElement;
  console.warn('------------------window width&height: ', window.innerWidth, window.innerHeight);
  console.warn('------------------documentElement width&height: ', document.documentElement.clientWidth, document.documentElement.clientHeight);
  console.log('targetEl offsetParent', targetElOffsetParent);
  // 判断目标元素的position不为static的父级元素是否为body
  let targetElOffsetParentIsDocument = !targetElOffsetParent || (documentNodeNames.includes(targetElOffsetParent.nodeName));
  console.log('targetElOffsetParentIsDocument', targetElOffsetParentIsDocument);
  let targetElOffsetParentOffset = { top: 0, left: 0 };
  if (!targetElOffsetParentIsDocument) {
    console.log('targetElOffsetParentIsDocument111111111111111111111');
    targetElOffsetParentOffset = offset(targetElOffsetParent);
  }
  // var targetElOpacity = tool.getStyle(targetEl, 'opacity');
  if (referenceIsInFixedPosition) {
    var bodyOverflow = getStyle(document.body, 'overflow');
    if (!targetElIsFixed && targetElOffsetParentIsDocument && bodyOverflow !== 'hidden') {
      // 如果reference元素处于fixed定位的父级容器，并且目标元素处于body元素下且不是fixed定位，则需要加上浏览器滚动条滚动的距离
      referenceOffset.top = referenceOffset.top + scrollTop();
      referenceOffset.left = referenceOffset.left + scrollLeft();
    }
    if (!targetElIsFixed && !targetElOffsetParentIsDocument) {
      needSubtractScrollOffset = true;
    }
  }

  let referenceScrollParent = getScrollParent(referenceEl);
  let referenceElWrapperScrollTop = 0;
  let referenceElWrapperScrollLeft = 0;
  // console.log('getScrollParent', tool.getScrollParent(ele).nodeName);
  // 如果参照元素有滚动条的父级元素并且不是body，则获取参照元素有滚动条的父级元素的滚动条位置
  if (referenceScrollParent && !documentNodeNames.includes(referenceScrollParent.nodeName)) {
    // console.log(']]]]]]]]]]]]]]]]]]]]]]]');
    referenceElWrapperScrollTop = scrollTop(referenceScrollParent);
    referenceElWrapperScrollLeft = scrollLeft(referenceScrollParent);
  }
  // let targetScrollParent = getScrollParent(targetEl);
  // 判断下拉内容是否插入在body中
  // let targetIsInBody = targetScrollParent && documentNodeNames.includes(targetScrollParent.nodeName);
  // let targetIsInBody = documentNodeNames.includes(targetEl.parentElement!.nodeName);
  // 目标元素的position不为static的父级元素如果是body，则下拉内容是插入到body中（因为下拉元素是相对于position不为static的父级元素进行定位的）
  let targetIsInBody = documentNodeNames.includes(targetElOffsetParent.nodeName);
  // console.log('targetScrollParent', targetScrollParent, targetEl);
  /* let bodyHasScroll = {
    vertical: false,
    horizontal: false
  }; */
  let bodyHasScroll = hasScroll();
  let bodyScrollVisible = {
    vertical: false,
    horizontal: false
  };
  if (targetIsInBody) {
    // bodyHasScroll = hasScroll();
    // console.log('7777777777777777');
    bodyScrollVisible = {
      vertical: getStyle(document.body, 'overflow-y') != 'hidden',
      horizontal: getStyle(document.body, 'overflow-x') != 'hidden'
    };
  }
  let bodyScrollWidth = scrollWidth();
  let terminal = checkTerminal();
  // 解决手机端浏览器地址栏隐藏后bottom值计算不准确问题
  let windowWH = {
    width: !terminal.pc ? Math.min(document.documentElement.clientWidth, window.innerWidth) : window.innerWidth,
    height: !terminal.pc ? Math.min(document.documentElement.clientHeight, window.innerHeight) : window.innerHeight
  };
  console.log('terminal', terminal);

  // console.log('eleWrapperScrollTop, eleWrapperScrollLeft', referenceElWrapperScrollTop, referenceElWrapperScrollLeft);

  // console.log('targetElDisplay', targetElDisplay);
  var targetElRect = targetEl.getBoundingClientRect();
  var targetElTransform = getEleTranslateValue(getStyle(targetEl, 'transform'));
  // console.log('targetElRect', targetElRect, tool.getStyle(targetEl, 'transform'), targetElTransform);
  // 如果dom元素设置了scale的话需要根据当前的宽高计算出元素真正的宽高，否则计算位置会不准确
  targetElRect.width = Math.round(targetElRect.width / Math.abs(targetElTransform.scaleX));
  targetElRect.height = Math.round(targetElRect.height / Math.abs(targetElTransform.scaleY));
  // console.log('计算scale后的宽高', {width: targetElRect.width, height: targetElRect.height});

  var dropdownOffsetTop = dropdownOffset?.top || 0;
  var dropdownOffsetLeft = dropdownOffset?.left || 0;

  var calcedDirection = null;
  var directionCalcFlow = []; // 存储按流程计算方向的函数，当下拉菜单在某个方向上不能完全展示时会自动切换一个方向
  var handleBottom = function (isBottomRight: boolean) {
    // 当参照物在有滚动条的容器中且目标元素插入在body时需减去容器滚动条滚动的距离
    // var top = referenceOffset.top + referenceRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    // var left = isBottomRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width)) : (referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0));
    var top = referenceOffset.top + referenceRect.height;
    var left = isBottomRight ? Math.floor(referenceOffset.left - (targetElRect.width - referenceRect.width)) : (referenceOffset.left);
    var bottom = null;
    var right = null;
    // console.log('targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0', targetElOffsetParentIsDocument, targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    // console.log('handleBottom,-----------', referenceOffset.left, targetElRect.width,referenceRect.width);
    // var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    top += dropdownOffsetTop;
    left += dropdownOffsetLeft;
    if (targetIsInBody) {
      console.log(`handleBottom----------targetIsInBody${isBottomRight ? '----isBottomRight' : ''}`, scrollInfo.top, bodyHasScroll);
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        top += scrollInfo.top;
        console.log('加上body滚动条滚动的距离');
      }

      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        left += scrollInfo.left;
      }
    }
    var isInView = eleIsInView({
      ele: targetEl,
      top,
      left,
      needSubtractScrollOffset,
      bodyScrollVisible,
      targetIsInBody,
      referenceIsInFixedPosition,
      documentHasScroll: bodyHasScroll,
      documentScrollInfo: scrollInfo,
      scrollParent: referenceScrollParent, // 获取目标元素所处有滚动条的父级容器
      windowWH: { ...windowWH }
    });
    console.log(`----------handleBottom isInView${isBottomRight ? '====isBottomRight' : ''}: `, isInView);
    // 如果目标元素插入到了body中，则需减去参照元素有滚动条父级容器滚动条滚动到距离（调用eleIsInView函数前不需要减去，因为eleIsInView函数内部计算时会减去）
    top -= targetIsInBody ? referenceElWrapperScrollTop : 0;
    left -= targetIsInBody ? referenceElWrapperScrollLeft : 0;

    if (targetIsInBody) {
      // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
      // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
      // bottom = window.innerHeight - referenceOffset.top + referenceElWrapperScrollTop;
      right = windowWH.width - referenceOffset.left + referenceElWrapperScrollLeft - referenceRect.width;
      // 如果浏览器有垂直滚动条，则需减去垂直滚动条的宽度，因为前面计算right值的时候使用的是window.innerWidth，window.innerWidth包含了滚动条
      if (bodyHasScroll.vertical && bodyScrollVisible.vertical) {
        right -= bodyScrollWidth.vertical;
        console.log('right值减去浏览器垂直滚动条的宽度', right, bodyScrollWidth.vertical);
      }
      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        right -= scrollInfo.left;
      }
    } else {
      // bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      right = targetElOffsetParent.offsetWidth - (referenceOffset.left - targetElOffsetParentOffset.left) - referenceRect.width + referenceElWrapperScrollLeft;
    }
    /* if (targetIsInBody) {
      /!* if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        bottom -= scrollInfo.top;
      } *!/
      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        right -= scrollInfo.left;
      }
    } */

    // console.log('handleBottom isInView', isInView, isBottomRight, (targetElRect.width - referenceRect.width), left);
    // 计算top值时需减去目标元素position不为static的父级元素的top值
    let newTop = top - targetElOffsetParentOffset.top;
    let newLeft = left - targetElOffsetParentOffset.left;
    newTop -= dropdownOffsetTop;
    newLeft -= dropdownOffsetLeft;
    return {
      ...isInView,
      direction: isBottomRight ? 'bottomEnd' : 'bottom',
      top: newTop,
      left: newLeft,
      bottom,
      right: isBottomRight ? right : null
    };
  };
  let handleTop = function (isTopRight: boolean) {
    // console.log('referenceElWrapperScrollTop', referenceOffset.top, tool.scrollTop(), referenceElWrapperScrollTop);
    // var top = referenceOffset.top - targetElRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    // var left = isTopRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0))) : referenceOffset.left;
    var top = referenceOffset.top - targetElRect.height;
    var left = isTopRight ? Math.floor(referenceOffset.left - (targetElRect.width - referenceRect.width)) : referenceOffset.left;

    // var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    top += dropdownOffsetTop;
    left += dropdownOffsetLeft;
    if (targetIsInBody) {
      console.log(`handleTop----------targetIsInBody${isTopRight ? '----isTopRight' : ''}`, scrollInfo.top, bodyHasScroll);
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        top += scrollInfo.top;
        console.log('加上body滚动条滚动的距离');
      }

      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        left += scrollInfo.left;
      }
    }
    var isInView = eleIsInView({
      ele: targetEl,
      top,
      left,
      needSubtractScrollOffset,
      bodyScrollVisible,
      targetIsInBody,
      referenceIsInFixedPosition,
      documentHasScroll: bodyHasScroll,
      documentScrollInfo: scrollInfo,
      scrollParent: referenceScrollParent, // 获取目标元素所处有滚动条的父级容器
      windowWH: { ...windowWH }
    });
    console.log(`----------handleTop isInView${isTopRight ? '====isTopRight' : ''}: `, isInView);
    // 如果目标元素插入到了body中，则需减去参照元素有滚动条父级容器滚动条滚动到距离（调用eleIsInView函数前不需要减去，因为eleIsInView函数内部计算时会减去）
    top -= targetIsInBody ? referenceElWrapperScrollTop : 0;
    left -= targetIsInBody ? referenceElWrapperScrollLeft : 0;
    // var bottom = referenceOffset.top - targetElOffsetParentOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) + referenceRect.height;
    var bottom = null;
    var right = null;
    if (targetIsInBody) {
      // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
      // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
      bottom = windowWH.height - referenceOffset.top + referenceElWrapperScrollTop;
      right = windowWH.width - referenceOffset.left + referenceElWrapperScrollLeft - referenceRect.width;
      // 如果浏览器有垂直滚动条，则需减去垂直滚动条的宽度，因为前面计算right值的时候使用的是window.innerWidth，window.innerWidth包含了滚动条
      if (bodyHasScroll.vertical && bodyScrollVisible.vertical) {
        right -= bodyScrollWidth.vertical;
        console.log('right值减去浏览器垂直滚动条的宽度', right, bodyScrollWidth.vertical);
      }
      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        right -= scrollInfo.left;
      }
      if (bodyHasScroll.horizontal && bodyScrollVisible.horizontal) {
        bottom -= bodyScrollWidth.horizontal;
        console.log('right值减去浏览器垂直滚动条的宽度', right, bodyScrollWidth.vertical);
      }
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        bottom -= scrollInfo.top;
      }
    } else {
      bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      right = targetElOffsetParent.offsetWidth - (referenceOffset.left - targetElOffsetParentOffset.left) - referenceRect.width + referenceElWrapperScrollLeft;
    }
    /* if (targetIsInBody) {
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        bottom -= scrollInfo.top;
      }
      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        right -= scrollInfo.left;
      }
    } */
    // console.log('handleTop isInView', isInView, top, left);
    // 计算top值时需减去目标元素position不为static的父级元素的top值
    let newTop = top - targetElOffsetParentOffset.top;
    let newLeft = left - targetElOffsetParentOffset.left;
    // console.log('newLeft11111', newLeft, left, isInView);
    newTop -= dropdownOffsetTop;
    newLeft -= dropdownOffsetLeft;
    // console.log('newLeft22222', newLeft);
    /* console.log('handleTop total result:', {
      top: newTop,
      bottom,
      right,
      left: newLeft
    }); */
    return {
      ...isInView,
      direction: isTopRight ? 'topEnd' : 'top',
      bottom,
      right: isTopRight ? right : null,
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: newTop,
      left: newLeft
    };
  };
  let handleLeft = function (isLeftBottom: boolean) {
    // var top = isLeftBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
    // var left = referenceOffset.left - targetElRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);
    var top = isLeftBottom ? Math.floor(referenceOffset.top - (targetElRect.height - referenceRect.height)) : (referenceOffset.top);
    var left = referenceOffset.left - targetElRect.width;
    var bottom = null;
    var right = null;

    top += dropdownOffsetTop;
    left += dropdownOffsetLeft;

    if (targetIsInBody) {
      console.log(`handleLeft----------targetIsInBody${isLeftBottom ? '----isLeftBottom' : ''}`, scrollInfo.top, bodyHasScroll);
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        top += scrollInfo.top;
        console.log('加上body滚动条滚动的距离');
      }

      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        left += scrollInfo.left;
      }
      if (isLeftBottom) {
        // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
        // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
        bottom = windowWH.height - (referenceOffset.top + referenceRect.height) + referenceElWrapperScrollTop;
        // right = window.innerWidth - referenceOffset.left + referenceElWrapperScrollLeft;
      }
    } else {
      if (isLeftBottom) {
        bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top + referenceRect.height - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      }
    }

    /* if (isLeftBottom) {
      if (targetIsInBody) {
        // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
        // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
        bottom = window.innerHeight - (referenceOffset.top + referenceRect.height) + referenceElWrapperScrollTop;
        // right = window.innerWidth - referenceOffset.left + referenceElWrapperScrollLeft;
      } else {
        bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top + referenceRect.height - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
        // right = targetElOffsetParent.offsetWidth - (referenceOffset.left - targetElOffsetParentOffset.left) + referenceRect.width - targetElRect.width;
      }
    } */

    // var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    var isInView = eleIsInView({
      ele: targetEl,
      top,
      left,
      needSubtractScrollOffset,
      bodyScrollVisible,
      targetIsInBody,
      referenceIsInFixedPosition,
      documentHasScroll: bodyHasScroll,
      documentScrollInfo: scrollInfo,
      scrollParent: referenceScrollParent, // 获取目标元素所处有滚动条的父级容器
      windowWH: { ...windowWH }
    });
    console.log(`----------handleLeft isInView${isLeftBottom ? '====isLeftBottom' : ''}: `, isInView, targetIsInBody, targetElOffsetParentOffset.left);
    // 如果目标元素插入到了body中，则需减去参照元素有滚动条父级容器滚动条滚动到距离（调用eleIsInView函数前不需要减去，因为eleIsInView函数内部计算时会减去）
    top -= targetIsInBody ? referenceElWrapperScrollTop : 0;
    left -= targetIsInBody ? referenceElWrapperScrollLeft : 0;
    if (targetIsInBody) {
      right = windowWH.width - referenceOffset.left + referenceElWrapperScrollLeft;
      // 如果浏览器有垂直滚动条，则需减去垂直滚动条的宽度，因为前面计算right值的时候使用的是window.innerWidth，window.innerWidth包含了滚动条
      if (bodyHasScroll.vertical && bodyScrollVisible.vertical) {
        right -= bodyScrollWidth.vertical;
        console.log('right值减去浏览器垂直滚动条的宽度，----left', right, bodyScrollWidth.vertical);
      }
      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        right -= scrollInfo.left;
      }
      if (isLeftBottom) {
        if (bodyHasScroll.horizontal && bodyScrollVisible.horizontal) {
          // @ts-ignore
          bottom -= bodyScrollWidth.horizontal;
          console.log('right值减去浏览器垂直滚动条的宽度', right, bodyScrollWidth.vertical);
        }
        if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
          // @ts-ignore
          bottom -= scrollInfo.top;
        }
      }
    } else {
      // let referenceIsTargetElOffsetParent = referenceEl === targetElOffsetParent;
      console.log('referenceIsTargetElOffsetParent[[[[[[[[[[[[[', targetElOffsetParent.offsetWidth, referenceOffset.left, targetElOffsetParentOffset.left, referenceElWrapperScrollLeft);
      // right = targetElOffsetParent.offsetWidth - (referenceOffset.left - targetElOffsetParentOffset.left) + referenceElWrapperScrollLeft;
      right = targetElOffsetParent.offsetWidth - (referenceOffset.left - targetElOffsetParentOffset.left); // + referenceElWrapperScrollLeft;
      // 如果参照元素有滚动条的父级元素等于目标元素的offsetParent，那么right值需要加上参照元素有滚动条的父级元素滚动条滚去的距离
      if (referenceScrollParent === targetElOffsetParent) {
        right += referenceElWrapperScrollLeft;
      }
    }
    let newTop = top - targetElOffsetParentOffset.top;
    let newLeft = left - targetElOffsetParentOffset.left;
    /* if (targetIsInBody) {
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        if (isLeftBottom) {
          // @ts-ignore
          bottom -= scrollInfo.top;
        }
      }
      if (right !== null) {
        if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
          right -= scrollInfo.left;
        }
      }
    } */
    newTop -= dropdownOffsetTop;
    newLeft -= dropdownOffsetLeft;
    // console.log('handleTop handleLeft', isInView);
    return {
      ...isInView,
      right,
      bottom,
      direction: isLeftBottom ? 'leftEnd' : 'left',
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: newTop,
      left: newLeft
    };
  };
  let handleRight = function (isRightBottom: boolean) {
    // var top = isRightBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
    // var left = referenceOffset.left + referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);
    var top = isRightBottom ? Math.floor(referenceOffset.top - (targetElRect.height - referenceRect.height)) : (referenceOffset.top);
    var left = referenceOffset.left + referenceRect.width;

    top += dropdownOffsetTop;
    left += dropdownOffsetLeft;

    if (targetIsInBody) {
      console.log(`handleRight----------targetIsInBody${isRightBottom ? '----isRightBottom' : ''}`, scrollInfo.top, bodyHasScroll);
      if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        top += scrollInfo.top;
        console.log('加上body滚动条滚动的距离');
      }

      if (bodyHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        // 如果下拉内容是插入在body中，且body的滚动条未显示出来则需要减去浏览器滚动条滚动的距离
        left += scrollInfo.left;
      }
    }

    var bottom = null;
    var right = null;
    if (isRightBottom) {
      if (targetIsInBody) {
        // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
        // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
        bottom = windowWH.height - (referenceOffset.top + referenceRect.height) + referenceElWrapperScrollTop;
      } else {
        bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top + referenceRect.height - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      }
    }

    // var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    var isInView = eleIsInView({
      ele: targetEl,
      top,
      left,
      bodyScrollVisible,
      needSubtractScrollOffset,
      targetIsInBody,
      referenceIsInFixedPosition,
      documentHasScroll: bodyHasScroll,
      documentScrollInfo: scrollInfo,
      scrollParent: referenceScrollParent, // 获取目标元素所处有滚动条的父级容器
      windowWH: { ...windowWH }
    });
    console.log(`----------handleRight isInView${isRightBottom ? '====isRightBottom' : ''}: `, isInView);
    // 如果目标元素插入到了body中，则需减去参照元素有滚动条父级容器滚动条滚动到距离（调用eleIsInView函数前不需要减去，因为eleIsInView函数内部计算时会减去）
    top -= targetIsInBody ? referenceElWrapperScrollTop : 0;
    left -= targetIsInBody ? referenceElWrapperScrollLeft : 0;
    let newTop = top - targetElOffsetParentOffset.top;
    let newLeft = left - targetElOffsetParentOffset.left;

    if (targetIsInBody) {
      if (isRightBottom) {
        if (bodyHasScroll.vertical && !bodyScrollVisible.vertical) {
          // @ts-ignore
          bottom -= scrollInfo.top;
        }
        if (bodyHasScroll.horizontal && bodyScrollVisible.horizontal) {
          // @ts-ignore
          bottom -= bodyScrollWidth.horizontal;
        }
      }
    }
    newTop -= dropdownOffsetTop;
    newLeft -= dropdownOffsetLeft;
    // console.log('handleTop handleRight', isInView);
    return {
      ...isInView,
      right,
      bottom,
      direction: isRightBottom ? 'rightEnd' : 'right',
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: newTop,
      left: newLeft
    };
  };

  switch (direction) {
    case 'bottom':
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleBottom
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleTop
      });
      if (tryAllDirection) {
        directionCalcFlow.push({
          isTail: false,
          handler: handleLeft
        });
        directionCalcFlow.push({
          isTail: false,
          handler: handleRight
        });
      }
      break;
    case 'top':
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleTop
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleBottom
      });
      if (tryAllDirection) {
        directionCalcFlow.push({
          isTail: false,
          handler: handleLeft
        });
        directionCalcFlow.push({
          isTail: false,
          handler: handleRight
        });
      }
      break;
    case 'left':
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleLeft
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleRight
      });
      if (tryAllDirection) {
        directionCalcFlow.push({
          isTail: false,
          handler: handleBottom
        });
        directionCalcFlow.push({
          isTail: false,
          handler: handleTop
        });
      }
      break;
    case 'right':
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleRight
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsEnd,
        handler: handleLeft
      });
      if (tryAllDirection) {
        directionCalcFlow.push({
          isTail: false,
          handler: handleBottom
        });
        directionCalcFlow.push({
          isTail: false,
          handler: handleTop
        });
      }
      break;
  }

  let defaultDirectionResult = {};
  // 尝试一遍当前方向的尾方向
  let tryReverse = function (allInView = false, flow: any) {
    let result = flow.handler(tryEndDirection ? !flow.isTail : flow.isTail);
    let inView = result.vertical && result.horizontal;
    let inScrollParentView = result.scrollParentVertical && result.scrollParentHorizontal;

    let flag = allInView ? (inView && inScrollParentView) : (inView || inScrollParentView);
    // console.log('tryReverse', flag, inView, inScrollParentView, result);

    if (result.direction === defaultDirection) {
      defaultDirectionResult = result;
    }

    if (flag) {
      calcedDirection = result;
      return true;
    }
    return false;
  };
  // 寻找元素在水平、垂直方向都完全出现在视口中的方向
  directionCalcFlow.some(function (flow) {
    let result = flow.handler(flow.isTail);
    // 判断在屏幕视口中是否完可视
    let inView = result.vertical && result.horizontal;
    // 判断在有滚动条的父级容器中是否完可视
    let inScrollParentView = result.scrollParentVertical && result.scrollParentHorizontal;

    if (result.direction === defaultDirection) {
      defaultDirectionResult = result;
    }
    if (inView) {
      // console.log('inView111, inScrollParentView', inView, inScrollParentView, result);
      if (!inScrollParentView) {
        let flag = tryReverse(true, flow);
        if (flag) {
          return true;
        }
        return false;
      }
      calcedDirection = result;
      return true;
    } else {
      // console.log('inView222, inScrollParentView', inView, inScrollParentView, result);
      return tryReverse(true, flow);
    }
  });
  console.log('calcedDirection', calcedDirection);
  // 如果尝试了所有方位后都无法显示，则显示默认方位
  if (!calcedDirection) {
    calcedDirection = defaultDirectionResult as any;
    calcedDirection.isRollback = true;
  }
  console.log('最终使用的方位：', calcedDirection);
  // 恢复目标元素的display、opacity属性
  targetEl.style.opacity = styleOpacity || '';
  targetEl.style.display = styleDisplay || '';
  return calcedDirection;
}

/**
 * 判断元素是否完全出现在视口中，优化性能，减少计算scrollParent、documentHasScroll、documentScrollInfo
 * @param {object} options
 * @returns {{horizontal: boolean, vertical: boolean}}
 */
function eleIsInView (options: any) {
  let {
    ele,
    top,
    left,
    needSubtractScrollOffset,
    documentHasScroll,
    documentScrollInfo,
    bodyScrollVisible,
    referenceIsInFixedPosition,
    scrollParent, // 获取目标元素有滚动条的父级容器
    windowWH
    // verticalRight, // 垂直方向展示且右对齐时的right值
    // horizontalBottom // 水平方向展示且底部对齐时的bottom值
  } = options;
  // var documentHasScroll = hasScroll();
  // 元素有滚动条的父级元素的滚动条高度
  let eleWrapperScrollTop = 0;
  let eleWrapperScrollLeft = 0;

  // 获取目标元素所处有滚动条的父级容器
  // let scrollParent = getScrollParent(ele);
  let scrollParentVertical = true;
  let scrollParentHorizontal = true;
  // 如果当前元素有滚动条的父级元素并且不是body，则判断元素在有滚动条的父级元素中是否可见
  if (scrollParent && !documentNodeNames.includes(scrollParent.nodeName)) {
    eleWrapperScrollTop = scrollTop(scrollParent);
    eleWrapperScrollLeft = scrollLeft(scrollParent);
    let newTop = top;
    let newLeft = left;
    console.log('bodyScrollVisible.vertical1111111', bodyScrollVisible.vertical);
    console.log('eleIsInView:scrollParent', scrollParent);
    // 只有参照元素是在固定定位的容器中时top、left才需要减去浏览器滚动条滚动的距离
    if (referenceIsInFixedPosition) {
      if (documentHasScroll.vertical && !bodyScrollVisible.vertical) {
        console.log('减去了documentScrollInfo.top');
        newTop -= documentScrollInfo.top;
      }
      if (documentHasScroll.horizontal && !bodyScrollVisible.horizontal) {
        newLeft -= documentScrollInfo.left;
      }
    }
    let scroll = eleIsInScrollParentView(ele, scrollParent, newTop, newLeft, needSubtractScrollOffset);
    // console.log('scrollParent scroll', scroll);
    scrollParentHorizontal = scroll.horizontal;
    scrollParentVertical = scroll.vertical;
  }
  // console.log('scrollTop/scrollLeft', scrollTop, scrollLeft);
  if (!top || !left) {
    var offsetValue = offset(ele);
    if (!top) {
      top = offsetValue.top;
    }
    if (!left) {
      left = offsetValue.left;
    }
  }

  if (documentHasScroll.vertical) {
    top -= documentScrollInfo.top;
  }
  if (documentHasScroll.horizontal) {
    left -= documentScrollInfo.left;
  }
  top = top - eleWrapperScrollTop;
  left = left - eleWrapperScrollLeft;

  let bottom = ele.offsetHeight + top;
  let right = ele.offsetWidth + left;
  // let windowWH = getDocumentWidthHeight();

  // 如果有浏览器有滚动条，则需减去滚动条的宽度
  if (documentHasScroll.vertical) {
    windowWH.width = windowWH.width - scrollWidth().vertical;
  }
  if (documentHasScroll.horizontal) {
    windowWH.height = windowWH.height - scrollWidth().horizontal;
  }
  // console.log('left', left, right, scrollLeft);
  // console.log('top', top, bottom, scrollTop);
  let verticalFullVisible = top > 0 && top < windowWH.height && bottom > 0 && bottom <= windowWH.height;
  let horizontalFullVisible = left > 0 && left < windowWH.width && right > 0 && right <= windowWH.width;
  // 目标元素垂直方向可见高度
  let verticalVisibleHeight = -1;
  let horizontalVisibleWidth = -1;
  if (!verticalFullVisible) {
    if (top < 0) {
      verticalVisibleHeight = ele.offsetHeight + top;
    } else if (bottom > windowWH.height) {
      verticalVisibleHeight = bottom - windowWH.height;
    }
  }

  if (!horizontalFullVisible) {
    if (left < 0) {
      horizontalVisibleWidth = ele.offsetWidth + left;
    } else if (right > windowWH.width) {
      horizontalVisibleWidth = right - windowWH.width;
    }
  }

  return {
    scrollParentHorizontal,
    scrollParentVertical,
    horizontalVisibleWidth,
    verticalVisibleHeight,
    vertical: verticalFullVisible,
    horizontal: horizontalFullVisible
  };
}
