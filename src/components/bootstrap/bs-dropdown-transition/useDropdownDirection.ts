import {
  offset,
  eleIsInFixedParents,
  getStyle,
  scrollTop,
  scrollLeft,
  getScrollParent,
  getEleTranslateValue,
  eleIsInView
} from '@/common/bs-util';

/**
 * 计算绝对定位元素能完全出现在视口的展示方位
 * @param referenceEl 参照元素
 * @param targetEl 目标元素
 * @param defaultDirection 默认方向，支持top、bottom、left、right
 * @param tryAllDirection 当切换到defaultDirection对应的反方向目标元素也不能完全出现在视口时是否尝试切换其他方向
 */
export function getDropdownDirection (referenceEl: HTMLElement, targetEl: HTMLElement, defaultDirection: string, tryAllDirection = false) {
  if (!referenceEl || !targetEl || !defaultDirection) {
    throw new Error('缺少referenceEl, targetEl, defaultDirection其中的某个参数');
  }
  let rightTailReg = /(\w+)Right$/;
  let bottomTailReg = /(\w+)Bottom$/;
  // 判断方向中是否含有Right
  let defaultDirectionIsRight = false;
  let defaultDirectionIsTop = false;
  if (rightTailReg.test(defaultDirection)) {
    defaultDirection = RegExp.$1;
    defaultDirectionIsRight = true;
  } else if (bottomTailReg.test(defaultDirection)) {
    defaultDirection = RegExp.$1;
    defaultDirectionIsTop = true;
  }
  let targetElOffsetParent = targetEl.offsetParent as HTMLElement;
  // console.log('targetEl offsetParent', targetEl.offsetParent);
  // 判断目标元素的position不为static的父级元素是否为body
  let targetElOffsetParentIsDocument = !targetElOffsetParent || (targetElOffsetParent.nodeName === 'BODY' || targetElOffsetParent.nodeName === 'HTML');
  let targetElOffsetParentOffset = { top: 0, left: 0 };
  if (!targetElOffsetParentIsDocument) {
    targetElOffsetParentOffset = offset(targetElOffsetParent);
  }
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
  var needSubtractScrollOffset = true; // 判断元素是否处于滚动容器视口时是否需要减去浏览器滚动条滚动的距离
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

  let scrollParent = getScrollParent(referenceEl);
  let referenceElWrapperScrollTop = 0;
  let referenceElWrapperScrollLeft = 0;
  // console.log('getScrollParent', tool.getScrollParent(ele).nodeName);
  // 如果参照元素有滚动条的父级元素并且不是body，则获取参照元素有滚动条的父级元素的滚动条位置
  if (scrollParent && scrollParent.nodeName != 'HTML' && scrollParent.nodeName != 'BODY') {
    // console.log(']]]]]]]]]]]]]]]]]]]]]]]');
    referenceElWrapperScrollTop = scrollTop(scrollParent);
    referenceElWrapperScrollLeft = scrollLeft(scrollParent);
  }
  // TODO
  let targetScrollParent = getScrollParent(targetEl);
  // console.log('eleWrapperScrollTop, eleWrapperScrollLeft', referenceElWrapperScrollTop, referenceElWrapperScrollLeft);

  // console.log('targetElDisplay', targetElDisplay);
  if (targetElDisplay === 'none') {
    targetEl.style.display = 'block';
    targetEl.style.opacity = '0';
  }
  var targetElRect = targetEl.getBoundingClientRect();
  var targetElTransform = getEleTranslateValue(getStyle(targetEl, 'transform'));
  // console.log('targetElRect', targetElRect, tool.getStyle(targetEl, 'transform'), targetElTransform);
  // 如果dom元素设置了scale的话需要根据当前的宽高计算出元素真正的宽高，否则计算位置会不准确
  targetElRect.width = Math.round(targetElRect.width / Math.abs(targetElTransform.scaleX));
  targetElRect.height = Math.round(targetElRect.height / Math.abs(targetElTransform.scaleY));
  // console.log('计算scale后的宽高', {width: targetElRect.width, height: targetElRect.height});

  var calcedDirection = null;
  var directionCalcFlow = []; // 存储按流程计算方向的函数，当下拉菜单在某个方向上不能完全展示时会自动切换一个方向
  var handleBottom = function (isBottomRight: boolean) {
    // 当参照物在有滚动条的容器中且目标元素插入在body时需减去容器滚动条滚动的距离
    var top = referenceOffset.top + referenceRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    console.log('targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0', targetElOffsetParentIsDocument, targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    var left = isBottomRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width)) : (referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0));
    // console.log('handleBottom,-----------', referenceOffset.left, targetElRect.width,referenceRect.width);
    var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    // console.log('handleBottom isInView', isInView, isBottomRight, (targetElRect.width - referenceRect.width), left);
    return {
      ...isInView,
      direction: isBottomRight ? 'bottomRight' : 'bottom',
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: top - targetElOffsetParentOffset.top,
      left: left - targetElOffsetParentOffset.left
    };
  };
  let handleTop = function (isTopRight: boolean) {
    // console.log('referenceElWrapperScrollTop', referenceOffset.top, tool.scrollTop(), referenceElWrapperScrollTop);
    var top = referenceOffset.top - targetElRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
    var left = isTopRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0))) : referenceOffset.left;
    var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    // var bottom = referenceOffset.top - targetElOffsetParentOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) + referenceRect.height;
    var bottom;
    if (targetElOffsetParentIsDocument) {
      // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
      // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
      bottom = window.innerHeight - referenceOffset.top + referenceElWrapperScrollTop;
    } else {
      bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
    }
    // console.log('handleTop isInView', isInView, top, left);
    return {
      ...isInView,
      direction: isTopRight ? 'topRight' : 'top',
      bottom,
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: top - targetElOffsetParentOffset.top,
      left: left - targetElOffsetParentOffset.left
    };
  };
  let handleLeft = function (isLeftBottom: boolean) {
    var top = isLeftBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
    var left = referenceOffset.left - targetElRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);

    var bottom;
    if (isLeftBottom) {
      if (targetElOffsetParentIsDocument) {
        // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
        // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
        bottom = window.innerHeight - (referenceOffset.top + referenceRect.height) + referenceElWrapperScrollTop;
      } else {
        bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top + referenceRect.height - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      }
    }

    var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    // console.log('handleTop handleLeft', isInView);
    return {
      ...isInView,
      bottom,
      direction: isLeftBottom ? 'leftBottom' : 'left',
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: top - targetElOffsetParentOffset.top,
      left: left - targetElOffsetParentOffset.left
    };
  };
  let handleRight = function (isRightBottom: boolean) {
    var top = isRightBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
    var left = referenceOffset.left + referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);

    var bottom;
    if (isRightBottom) {
      if (targetElOffsetParentIsDocument) {
        // 如果目标元素插入在body中，则bottom的值为浏览器可见高度减去参照元素至浏览器最顶端的距离，再加上参照元素滚动容器滚动滚动的距离即可
        // 实际为：浏览器可见高度-参照元素在可见高度内的位置-浏览器滚动条滚动的距离+参照元素滚动容器滚动滚动的距离
        bottom = window.innerHeight - (referenceOffset.top + referenceRect.height) + referenceElWrapperScrollTop;
      } else {
        bottom = targetElOffsetParent.offsetHeight - (referenceOffset.top + referenceRect.height - targetElOffsetParentOffset.top);// + referenceElWrapperScrollTop;
      }
    }

    var isInView = eleIsInView(targetEl, top, left, needSubtractScrollOffset);
    // console.log('handleTop handleRight', isInView);
    return {
      ...isInView,
      bottom,
      direction: isRightBottom ? 'rightBottom' : 'right',
      // 计算top值时需减去目标元素position不为static的父级元素的top值
      top: top - targetElOffsetParentOffset.top,
      left: left - targetElOffsetParentOffset.left
    };
  };

  switch (defaultDirection) {
    case 'bottom':
      directionCalcFlow.push({
        isTail: defaultDirectionIsRight,
        handler: handleBottom
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsRight,
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
        isTail: defaultDirectionIsRight,
        handler: handleTop
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsRight,
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
        isTail: defaultDirectionIsTop,
        handler: handleLeft
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsTop,
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
        isTail: defaultDirectionIsTop,
        handler: handleRight
      });
      directionCalcFlow.push({
        isTail: defaultDirectionIsTop,
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
    // 尝试一遍当前方向的尾方向
    let tryReverse = function (allInView = false) {
      let result = flow.handler(!flow.isTail);
      let inView = result.vertical && result.horizontal;
      let inScrollParentView = result.scrollParentVertical && result.scrollParentHorizontal;

      let flag = allInView ? (inView && inScrollParentView) : (inView || inScrollParentView);
      // console.log('tryReverse', flag, inView, inScrollParentView, result);

      if (flag) {
        calcedDirection = result;
        return true;
      }
      return false;
    };

    if (result.direction === defaultDirection) {
      defaultDirectionResult = result;
    }
    if (inView) {
      // console.log('inView111, inScrollParentView', inView, inScrollParentView, result);
      if (!inScrollParentView) {
        let flag = tryReverse(true);
        if (flag) {
          return true;
        }
        return false;
      }
      calcedDirection = result;
      return true;
    } else {
      // console.log('inView222, inScrollParentView', inView, inScrollParentView, result);

      return tryReverse(true);
    }

    /* // 尝试一遍当前方向的尾方向
    if (!inView) {
      result = flow.handler(!flow.isTail);
      inView = result.vertical && result.horizontal;
    }
    if (inView) {
      calcedDirection = result;
    }
    return inView; */
  });
  console.log('calcedDirection', calcedDirection);
  // 如果尝试了所有方位后都无法显示，则显示默认方位
  if (!calcedDirection) {
    /* switch (defaultDirection) {
      case 'bottom':
        calcedDirection = handleBottom();
        break;
      case 'top':
        calcedDirection = handleTop();
        break;
      case 'left':
        calcedDirection = handleLeft();
        break;
      case 'right':
        calcedDirection = handleRight();
        break;
    } */
    calcedDirection = defaultDirectionResult as any;
    calcedDirection.isRollback = true;
  }
  console.log('最终使用的方位：', calcedDirection);
  // 恢复目标元素的display、opacity属性
  if (styleOpacity) {
    targetEl.style.opacity = styleOpacity;
  } else {
    targetEl.style.opacity = '';
  }
  if (styleDisplay) {
    targetEl.style.display = styleDisplay;
  } else {
    targetEl.style.display = '';
  }
  return calcedDirection;
}
