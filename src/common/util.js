/* tslint:disable */
/* eslint-disable */
var tool = {
  // 获取浏览器宽高
  getDocumentWidthHeight () {
    if (window.innerHeight != null) {
      return {
        width: window.innerWidth, // 包含了浏览器的滚动条
        height: window.innerHeight
      };
    } else if (document.compatMode === 'CSS1Compat') {
      // 怪异模式浏览器
      return {
        width: document.documentElement.scrollWidth, // 不包含浏览器滚动条
        height: document.documentElement.scrollHeight
      };
    }
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
  },
  /**
   * 获取元素距浏览器最顶部及最左边的距离
   * @param ele dom元素
   * @returns {{top: number, left: number}}
   */
  offset (ele) {
    var positon = {
      top: 0,
      left: 0
    };
    if (!ele || ele.nodeType != 1) {
      return positon;
    }
    var offsetParent = ele.offsetParent;
    positon.top = ele.offsetTop;
    positon.left = ele.offsetLeft;
    while (offsetParent != null) {
      positon.top += offsetParent.offsetTop;
      positon.left += offsetParent.offsetLeft;
      offsetParent = offsetParent.offsetParent;
    }
    return positon;
  },
  /**
   * 获取元素距指定父级元素最顶部及最左边的距离
   * @param ele dom元素
   * @param boundaryParent 边界父级元素，默认为null
   * @returns {{top: number, left: number}}
   */
  offsetInParent (ele, boundaryParent = null) {
    var positon = {
      top: 0,
      left: 0
    };
    var elOffset = tool.offset(ele);
    var parentOffset = {
      top: 0,
      left: 0
    };
    if (boundaryParent) {
      parentOffset = tool.offset(boundaryParent);
    }
    positon.top = elOffset.top - parentOffset.top;
    positon.left = elOffset.left - parentOffset.left;
    return positon;
  },
  /**
   * 判断元素是否有滚动条
   * @param ele dom元素
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  eleHasScroll (ele) {
    var result = {
      vertical: false,
      horizontal: false
    };
    if (!(ele instanceof HTMLElement)) {
      return result;
    }
    if (ele.scrollTop > 0) {
      result.vertical = true;
    } else {
      ele.scrollTop++;
      // 元素不能滚动的话，scrollTop 设置不会生效，还会置为 0
      const top = ele.scrollTop;
      // 重置滚动位置
      top && (ele.scrollTop = 0);
      // return top > 0;
      result.vertical = top > 0;
    }
    if (ele.scrollLeft > 0) {
      result.horizontal = true;
    } else {
      ele.scrollLeft++;
      // 元素不能滚动的话，scrollLeft 设置不会生效，还会置为 0
      const left = ele.scrollLeft;
      // 重置滚动位置
      left && (ele.scrollLeft = 0);
      // return top > 0;
      result.horizontal = left > 0;
    }
    return result;
  },
  /**
   * 获取元素有滚动条的父级元素
   * @param ele
   */
  getScrollParent (ele) {
    if (!ele) {
      return;
    }
    var eleParent = ele.parentElement;
    while (eleParent != null) {
      var scroll = tool.eleHasScroll(eleParent);
      if (scroll.vertical || scroll.horizontal) {
        return eleParent;
      }
      eleParent = eleParent.parentElement;
    }
  },
  /**
   * 判断元素是否完全出现在视口中
   * @param ele dom元素
   * @param top dom元素距浏览器最顶端的距离
   * @param left dom元素距浏览器最左端的距离
   * @param needSubtractScrollOffset 判断元素是否处于滚动容器视口时是否需要减去浏览器滚动条滚动的距离
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  eleIsInView (ele, top, left, needSubtractScrollOffset = true) {
    var hasScroll = tool.hasScroll();
    // 元素有滚动条的父级元素的滚动条高度
    let eleWrapperScrollTop = 0;
    let eleWrapperScrollLeft = 0;

    // 获取目标元素所处有滚动条的父级容器
    let scrollParent = tool.getScrollParent(ele);
    let scrollParentVertical = true;
    let scrollParentHorizontal = true;
    // 如果当前元素有滚动条的父级元素并且不是body，则判断元素在有滚动条的父级元素中是否可见
    if (scrollParent && scrollParent.nodeName != 'HTML' && scrollParent.nodeName != 'BODY') {
      eleWrapperScrollTop = tool.scrollTop(scrollParent);
      eleWrapperScrollLeft = tool.scrollLeft(scrollParent);
      let scroll = tool.eleIsInScrollParentView(ele, scrollParent, top, left, needSubtractScrollOffset);
      // console.log('scrollParent scroll', scroll);
      scrollParentHorizontal = scroll.horizontal;
      scrollParentVertical = scroll.vertical;
    }
    // console.log('scrollTop/scrollLeft', scrollTop, scrollLeft);
    if(!top){
      top = tool.offset(ele).top;
    }
    if(!left){
      left = tool.offset(ele).left;
    }

    if (hasScroll.vertical) {
      top -= tool.scrollTop();
    }
    if (hasScroll.horizontal) {
      left -= tool.scrollLeft();
    }
    top = top - eleWrapperScrollTop;
    left = left - eleWrapperScrollLeft;

    let bottom = ele.offsetHeight + top;
    let right = ele.offsetWidth + left;
    let windowWH = tool.getDocumentWidthHeight();
    // 如果有浏览器有滚动条，则需减去滚动条的宽度
    if (hasScroll.vertical) {
      windowWH.width = windowWH.width - tool.scrollWidth().vertical;
    }
    if (hasScroll.horizontal) {
      windowWH.height = windowWH.height - tool.scrollWidth().horizontal
    }
    // console.log('left', left, right, scrollLeft);
    // console.log('top', top, bottom, scrollTop);
    return {
      scrollParentHorizontal,
      scrollParentVertical,
      vertical: top > 0 && top < windowWH.height && bottom > 0 && bottom <= windowWH.height,
      horizontal: left > 0 && left < windowWH.width && right > 0 && right <= windowWH.width
    };
  },
  /**
   * 判断元素是否完全出现在父级容器的可视区域中
   * @param ele
   * @param referenceEl
   * @param eleOffsetX 元素x轴坐标的偏移量
   * @param eleOffsetY 元素y轴坐标的偏移量
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  eleIsInParentView (ele, referenceEl, eleOffsetX = 0, eleOffsetY = 0) {
    var result = {
      horizontal: true,
      vertical: true
    };
    if (!ele || !referenceEl) {
      return result;
    }
    var referenceOffset = tool.offset(referenceEl);
    var offset = tool.offset(ele);
    offset.left += eleOffsetX;
    offset.top += eleOffsetY;

    var referenceOffsetRight = referenceOffset.left + referenceEl.offsetWidth;
    var referenceOffsetBottom = referenceOffset.top + referenceEl.offsetHeight;
    var eleOffsetRight = offset.left + ele.offsetWidth;
    var eleOffsetBottom = offset.top + ele.offsetHeight;

    // console.log('eleInParentFullView, el.offset', offset, eleOffsetRight, eleOffsetBottom);
    // console.log('eleInParentFullView, el.reference', referenceOffset, referenceOffsetRight, referenceOffsetBottom);

    // 元素的水平方向完全在可视区域中
    var offsetStartInView = offset.left >= referenceOffset.left && offset.left < referenceOffsetRight;
    var offsetEndInView = eleOffsetRight > referenceOffset.left && eleOffsetRight < referenceOffsetRight;
    // console.log('offsetEndInView', offsetEndInView, eleOffsetRight, referenceOffsetRight);

    // 元素的垂直方向完全在可视区域中
    var offsetStartInView2 = offset.top >= referenceOffset.top && offset.top < referenceOffsetBottom;
    var offsetEndInView2 = eleOffsetBottom > referenceOffset.top && eleOffsetBottom < referenceOffsetBottom;

    result.horizontal = offsetStartInView && offsetEndInView;
    result.vertical = offsetStartInView2 && offsetEndInView2;

    return result;
  },
  /**
   * 判断元素是否完全出现在有滚动条的父级容器的可视区域中
   * @param ele dom元素
   * @param scrollEl 有滚动条的父级容器
   * @param top ele的top值
   * @param left ele的left值
   * @param needSubtractScrollOffset 判断元素是否处于滚动容器视口时是否需要减去浏览器滚动条滚动的距离
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  eleIsInScrollParentView (ele, scrollEl, top = 0, left = 0, needSubtractScrollOffset = true) {
    var result = {
      horizontal: true,
      vertical: true
    };
    if (!ele || !scrollEl) {
      return result;
    }
    // var scrollElRect = scrollEl.getBoundingClientRect();
    var scrollElOffset = tool.offset(scrollEl);
    var scrollElScrollTop = tool.scrollTop(scrollEl);
    var scrollElScrollLeft = tool.scrollLeft(scrollEl);
    var elOffset = {
      top,
      left
    };
    if (!top) {
      elOffset.top = tool.offset(ele).top;
    }
    if (!left) {
      elOffset.left = tool.offset(ele).left;
    }

    // console.log('--------elOffset: ', {...elOffset});
    elOffset.top -= scrollElScrollTop;
    elOffset.left -= scrollElScrollLeft;
    if (needSubtractScrollOffset) {
      // console.log('eleInScrollParentFullView 需要减去浏览器滚动条的距离');
      var scrollTop = tool.scrollTop();
      var scrollLeft = tool.scrollLeft();
      elOffset.top -= scrollTop;
      elOffset.left -= scrollLeft;

      scrollElOffset.top -= scrollTop;
      scrollElOffset.left -=  scrollLeft;
    }
    // console.log('--------elOffset: ', {...elOffset}, scrollElScrollTop, scrollElScrollLeft);

    var scrollElOffsetRight = scrollElOffset.left + scrollEl.offsetWidth;
    var scrollElOffsetBottom = scrollElOffset.top + scrollEl.offsetHeight;
    var eleOffsetRight = elOffset.left + ele.offsetWidth;
    var eleOffsetBottom = elOffset.top + ele.offsetHeight;

    // console.log('eleInParentFullView, el.offset', offset, eleOffsetRight, eleOffsetBottom);
    // console.log('eleInParentFullView, el.reference', scrollElOffset, scrollElOffsetRight, scrollElOffsetBottom);

    // 元素的水平方向完全在可视区域中
    var offsetStartInView = elOffset.left >= scrollElOffset.left && elOffset.left < scrollElOffsetRight;
    var offsetEndInView = eleOffsetRight > scrollElOffset.left && eleOffsetRight < scrollElOffsetRight;

    // 元素的垂直方向完全在可视区域中
    var offsetStartInView2 = elOffset.top >= scrollElOffset.top && elOffset.top < scrollElOffsetBottom;
    var offsetEndInView2 = eleOffsetBottom > scrollElOffset.top && eleOffsetBottom < scrollElOffsetBottom;

    result.horizontal = offsetStartInView && offsetEndInView;
    result.vertical = offsetStartInView2 && offsetEndInView2;

    return result;
  },
  /**
   * 判断dom元素是否处于fixed定位的元素中
   * @param ele dom元素
   * @returns {boolean}
   */
  eleIsInFixedParents (ele) {
    if (!ele || !ele.nodeType || ele.nodeType != 1) {
      return false;
    }
    var offsetParent = ele.offsetParent;
    var isFixedPosition = false;
    while (offsetParent != null && !isFixedPosition) {
      var positionVal = tool.getStyle(offsetParent, 'position');
      if (positionVal === 'fixed') {
        isFixedPosition = true;
        break;
      }
      offsetParent = offsetParent.offsetParent;
    }
    return isFixedPosition;
  },
  /**
   * 判断元素是否在指定的父级元素内
   * @param ele dom元素
   * @param parent 父级元素
   * @returns {boolean}
   */
  eleInParent (ele, parent) {
    var flag = false;
    var parentEle = ele.parentElement;
    while (parentEle != null) {
      if (parentEle === parent) {
        flag = true;
        break;
      }
      parentEle = parentEle.parentElement;
    }
    // console.warn('eleInParent: ', flag);
    return flag;
  },
  /**
   * 获取dom元素或浏览器垂直滚动条的位置
   * @param ele dom元素（可选）
   * @returns {number|number}
   */
  scrollTop (ele) {
    if (ele && ele.nodeType == 1) {
      return ele.scrollTop;
    }
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  },
  /**
   * 获取dom元素或浏览器水平滚动条的位置
   * @param ele dom元素（可选）
   * @returns {number|number}
   */
  scrollLeft (ele) {
    if (ele && ele.nodeType == 1) {
      return ele.scrollLeft;
    }
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  },
  /**
   * 获取元素或浏览器滚动条的宽高
   * @param ele dom元素
   * @returns {{horizontal: number, vertical: number}}
   */
  scrollWidth (ele) {
    var tempDiv;
    var tempInnerDiv = document.createElement('div');
    var result = {
      vertical: 0,
      horizontal: 0
    };
    tempInnerDiv.style.cssText = 'width: 200px;height: 200px';
    if (!ele || ele.nodeType != 1) { // 未传递dom元素则获取浏览器的滚动条
      result.vertical = window.innerWidth - document.documentElement.offsetWidth;
      result.horizontal = window.innerHeight - document.documentElement.clientHeight;
      return result;
    }
    /* if (!isGetElementScrollWidth) { // 未传递dom元素则获取浏览器的滚动条
      /!* tempDiv = document.createElement('div');
      tempDiv.style.cssText = 'width: 100px;height: 100px;opacity: 0;position:absolute;left: -100px;overflow:auto;'; *!/
      result.vertical = window.innerWidth - document.documentElement.offsetWidth;
      result.horizontal = window.innerHeight - document.documentElement.clientHeight;
      return result;
    } else if (ele) {
      tempDiv = ele.cloneNode(true);
    } else if (isGetElementScrollWidth && !ele) {
      tempDiv = document.createElement('div');
    } */
    tempDiv = ele.cloneNode(true);
    tempDiv.style.cssText = 'width: 100px;height: 100px;opacity: 0;position:absolute;left: -100px;overflow:auto;';
    tempDiv.appendChild(tempInnerDiv);
    document.body.appendChild(tempDiv);

    result.vertical = tempDiv.offsetWidth - tempDiv.clientWidth;
    result.horizontal = tempDiv.offsetHeight - tempDiv.clientHeight;

    document.body.removeChild(tempDiv);
    tempDiv = tempInnerDiv = null;
    return result;
  },
  /**
   * 设置元素滚动条滚动距离
   * @param ele dom元素或window对象
   * @param direction 滚动条方向，默认为y，可选值有：x、y
   * @param to 滚动条即将滚动到到位置
   * @param duration 时长
   * @param onDone 完成后的回调
   * @param onScroll 正在滚动中的回调
   * @returns {boolean}
   */
  scrollTo (ele, direction, to, duration, onDone, onScroll) {
    if (!ele) {
      return false;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000/60);
        }
      );
    }
    if (!direction) {
      direction = 'y';
    }
    direction = direction == 'x' ? 'x' : 'y';
    var doDone = function () {
      if (typeof onDone == 'function') {
        onDone();
      }
    }
    var callOnScroll = function () {
      if (typeof onScroll == 'function') {
        onScroll();
      }
    }
    var attr = direction == 'x' ? 'scrollLeft' : 'scrollTop';
    if (!duration || duration <= 0) {
      if (ele === window) {
        window.scrollTo(direction === 'x' ? to : tool.scrollLeft(), direction === 'y' ? to : tool.scrollTop());
      } else {
        ele[attr] = to;
      }
      callOnScroll();
      doDone();
      return true;
    }

    var diff = to - ele[attr];
    if (ele === window) {
      diff = to - (direction == 'x' ? tool.scrollLeft() : tool.scrollTop());
    }
    var perTick = (diff / duration) * 10;
    window.requestAnimationFrame(function () { // 实现缓动效果
      if (ele === window) {
        let x = tool.scrollLeft();
        let y = tool.scrollTop();
        window.scrollTo(direction === 'x' ? (x + perTick) : x, direction === 'y' ? (y + perTick) : y);
        callOnScroll();
        if (direction == 'x' ? tool.scrollLeft() : tool.scrollTop() !== to) {
          tool.scrollTo(ele, direction, to, duration - 10, onDone, onScroll);
        } else {
          callOnScroll();
          doDone();
        }
        return;
      }
      ele[attr] += perTick;
      if (ele[attr] !== to) {
        callOnScroll();
        tool.scrollTo(ele, direction, to, duration - 10, onDone, onScroll);
      } else {
        callOnScroll();
        doDone();
      }
    });
    return true;
  },
  /**
   * 给指定元素添加class
   * @param ele
   * @param classname
   */
  addClass (ele, classname) {
    if (!ele || !classname || ele.nodeType !== 1) {
      return;
    }
    var classArr = classname.split(' ');
    if (ele.classList) {
      for (var i = 0, len = classArr.length; i < len; i++) {
        var item = classArr[i];
        if (!ele.classList.contains(item)) {
          ele.classList.add(item);
        }
      }
      return ele;
    } else {
      var classNameArr = ele.className && ele.className.length > 0 ? ele.className.split(' ') : [];
      if (classNameArr.length === 0) {
        ele.className = classname;
        return;
      }
      // 合并两个数组
      Array.prototype.push.apply(classNameArr, classArr);
      classNameArr = tool.arrayNoReapeat(classNameArr);
      ele.className = classNameArr.join(' ');
      return ele;
    }
  },
  /**
   * 数组去重
   * @param arr 需要去重的数组
   * @param isObjectValue 数组的值是否是引用类型
   */
  arrayNoReapeat (arr, isObjectValue) {
    if (!arr || arr.length === 0) {
      return arr;
    }
    isObjectValue = typeof isObjectValue === 'undefined' ? false : !!isObjectValue;
    var arrLen = arr.length;
    let newArr = [];
    // 值类型的数组，使用对象属性唯一的特性来去重
    if (!isObjectValue) {
      var obj = {};
      for (var i = 0; i < arrLen; i++) {
        obj[arr[i]] = 1;
      }
      for (var attr in obj) {
        newArr.push(attr);
      }
      return newArr;
    }

    newArr.push(arr[0]);
    for (var i = 1; i < arrLen; i++) {
      let item = arr[i];
      let repeat = false;
      for (var j = 0; j < newArr.length; j++) {
        if (item === arr[j]) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        newArr.push(item);
      }
    }
    return newArr;
  },
  /**
   * 给指定元素移除class
   * @param ele
   * @param classname
   */
  removeClass (ele, classname) {
    if (!ele || !classname || ele.nodeType !== 1) {
      return;
    }
    var classArr = classname.split(' ');
    if (ele.classList) {
      for (var i = 0, len = classArr.length; i < len; i++) {
        var item = classArr[i];
        if (ele.classList.contains(item)) {
          ele.classList.remove(item);
        }
      }
      return ele;
    } else {
      var classNameArr = ele.className && ele.className.length > 0 ? ele.className.split(' ') : [];
      if (classNameArr.length === 0) {
        return;
      }
      for (var i = classNameArr.length; i >= 0; i--) {
        for (var j = 0, len2 = classArr.length; j < len2; j++) {
          if (classNameArr[i] === classArr[j]) {
            classNameArr.splice(i, 1);
          }
        }
      }
      ele.className = classNameArr.join(' ');
      return ele;
    }
  },
  /**
   * 判断元素是否包含指定className
   * @param ele dom元素
   * @param className className
   * @returns {boolean}
   */
  hasClass (ele, className) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return
    }
    if (!className) {
      console.error('className 必须是一个字符串');
      return
    }
    if (ele.classList) {
      return ele.classList.contains(className);
    } else {
      var flag = false
      var classNameArr = ele.className.split(' ');
      for (var i = 0, len = classNameArr.length; i < len; i++) {
        if (classNameArr[i] === className) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  /**
   * 获取元素的css属性值
   * @param ele dom元素
   * @param cssAttribute css属性名称
   */
  getStyle (ele, cssAttribute) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return;
    }
    if (!cssAttribute) {
      console.error('cssAttribute 必须是一个字符串');
      return;
    }
    var val = '';
    if (window.getComputedStyle) {
      val = window.getComputedStyle(ele, null)[cssAttribute];
    } else if (ele.currentStyle) {
      val = ele.currentStyle[cssAttribute];
    }
    if (!isNaN(parseFloat(val))) {
      return parseFloat(val);
    } else {
      return val;
    }
  },
  /**
   * 获取元素的transform: translate的值
   * @param transformValue
   * @returns {{x:number;y:number;z:number;rotate:number;}}
   */
  getEleTranslateValue(transformValue) {
    var resultObj = {
      x: 0,
      y: 0,
      z: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1
    };
    // console.log('transformValue', transformValue);
    if (!transformValue || transformValue == 'none') {
      return resultObj;
    }
    var translates = transformValue.substring(6);
    // console.log('translates', translates);
    var result = translates.match(/\(([^)]*)\)/);// 正则()内容
    // console.log('result', result)
    //获取Rotate值
    var getRotate = function(matrix) {
      var aa = Math.round(180 * Math.asin(matrix[0]) / Math.PI);
      var bb = Math.round(180 * Math.acos(matrix[1]) / Math.PI);
      var cc = Math.round(180 * Math.asin(matrix[2]) / Math.PI);
      var dd = Math.round(180 * Math.acos(matrix[3]) / Math.PI);
      var deg = 0;
      if (aa == bb || -aa == bb) {
        deg = dd;
      } else if (-aa + bb == 180) {
        deg = 180 + cc;
      } else if (aa + bb == 180) {
        deg = 360 - cc || 360 - dd;
      }
      return deg >= 360 ? 0 : deg;
    }
    var matrix = result ? result[1].split(',') : translates.split(',');
    // console.log('matrix', matrix);
    resultObj.x = matrix.length > 6 ? parseFloat(matrix[12]) : parseFloat(matrix[4]);
    resultObj.y = matrix.length > 6 ? parseFloat(matrix[13]) : parseFloat(matrix[5]);
    resultObj.z = matrix.length > 6 ? parseFloat(matrix[14]) : 0;
    resultObj.rotate = matrix.length > 6 ? getRotate([parseFloat(matrix[0]), parseFloat(matrix[1]), parseFloat(matrix[4]), parseFloat(matrix[5])]) : getRotate(matrix);
    resultObj.scaleX =  parseFloat(matrix[0]);
    resultObj.scaleY =  parseFloat(matrix[3]);

    return resultObj;
  },
  /**
   * 给元素设置css属性
   * @param ele dom元素
   * @param attr css属性名
   * @param val css属性值，如果不传递attr参数，则该参数可以为一个对象，就像jquery的css()方法一样
   */
  setCss (ele, attrs, val) {
    if (!ele || !ele.nodeName) {
      console.error('ele 必须是一个dom元素');
      return;
    }
    var type1 = ({}).toString.call(attrs);
    // 需要字段加单位的css属性
    var autoAddUnitAttr = {
      width: 1,
      height: 1,
      margin: 1,
      padding: 1,
      borderRadius: 1,
      top: 1,
      left: 1,
      marginLeft: 1,
      marginRight: 1,
      marginTop: 1,
      marginBottom: 1,
      right: 1,
      bottom: 1,
      paddingLeft: 1,
      paddingRight: 1,
      paddingTop: 1,
      paddingBottom: 1,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1,
      fontSize: 1,
      lineHeight: 1,
      textIndent: 1,
      minWidth: 1,
      maxWith: 1,
    };
    if (type1 === '[object String]' && typeof val !== 'undefined') {
      attrs = attrs.replace(/\-(\w)/g, function (matched, $1) {
        return $1.toUpperCase();
      })
      if (attrs in autoAddUnitAttr && !isNaN(Number(val))) {
        ele.style[attrs] = val + 'px';
      } else {
        ele.style[attrs] = val;
      }
    } else if (type1 === '[object Object]') {
      var style = ele.style;
      for (var attr in attrs) {
        var val2 = attrs[attr];
        var isNumber = Number(val2);

        attr = attr.replace(/\-(\w)/g, function (matched, $1) {
          return $1.toUpperCase();
        });

        if (attr in autoAddUnitAttr && !isNaN(isNumber)) {
          style[attr] = val2 + 'px';
        } else {
          style[attr] = val2;
        }
      }
    }
    return this;
  },
  /**
   * 获取兄弟节点
   * @param elm
   * @returns {Array}
   */
  siblings (elm) {
    var a = [];
    var p = elm.parentNode.children;
    for (var i = 0, pl = p.length; i < pl; i++) {
      if (p[i] !== elm) a.push(p[i]);
    }
    return a;
  },
  /**
   * 判断两个元素是否是包含关系
   * @param ele 父元素
   * @param childEle 子元素
   * @returns {Boolean}
   */
  elementContains (ele, childEle) {
    if (ele === childEle) {
      return false;
    }
    if (!ele) {
      return false;
    }
    if (typeof ele.contains === 'function') {
      return ele.contains(childEle);
    } else {
      while (true) {
        if (!childEle) {
          return false;
        }
        if (childEle === ele) {
          return true;
        } else {
          childEle = childEle.parentNode;
        }
      }
      return false;
    }
  },

  /**
   * 获取数组中符合条件的元素的索引
   * @param arr 数组
   * @param fn 一个函数，如果函数返回true，则返回该项的下标，如果没有找到则返回-1
   */
  getIndex (arr, fn) {
    if (!arr || arr.length === 0 || !fn || (typeof fn !== 'function')) {
      return -1;
    }

    if (arr.findIndex) {
      return arr.findIndex(fn);
    }
    var len = arr.length;
    var i = 0;
    var index = -1;
    for (; i < len; i++) {
      var item = arr[i];
      if (fn(item, index, arr) === true) {
        index = i;
        break;
      }
    }
    return index;
  },
  /**
   * 对象/数组拷贝，支持深拷贝（jQuery代码）
   * @returns {any}
   */
  extend: function () {
    var isFunction = function isFunction (obj) {
      return typeof obj === 'function' && typeof obj.nodeType !== 'number';
    };
    var isPlainObject = function (obj) {
      var proto, Ctor;
      // Detect obvious negatives
      // Use toString instead of jQuery.type to catch host objects
      if (!obj || toString.call(obj) !== '[object Object]') {
        return false;
      }
      proto = Object.getPrototypeOf(obj);
      // Objects with no prototype (e.g., `Object.create( null )`) are plain
      if (!proto) {
        return true;
      }
      // Objects with prototype are plain iff they were constructed by a global Object function
      Ctor = ({}).hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor === 'function' && ({}).toString.call(Ctor) === ({}).toString.call(Object);
    }
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;

      // Skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {

      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {

        // Extend the base object
        for (name in options) {
          copy = options[name];

          // Prevent Object.prototype pollution
          // Prevent never-ending loop
          if (name === '__proto__' || target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isPlainObject(copy) ||
            (copyIsArray = Array.isArray(copy)))) {
            src = target[name];

            // Ensure proper type for the source value
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;

            // Never move original objects, clone them
            target[name] = tool.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  },

  /**
   * 判断对象是否是一个空对象
   * @param obj
   */
  isEmptyObject (obj) {
    for (var attr in obj) {
      return false;
    }
    return true;
  },
  /**
   * 获取元素的指定父级元素
   * @param el dom 元素
   * @param className 父元素的class name
   * @returns {dom、undefined}
   */
  parents (el, className) {
    if (!el || !el.nodeName || !className) {
      return;
    }
    var classNameArr = className.split(' ');
    var parent = el.parentElement;

    while (parent) {
      var flag = true;
      for (var i = 0, len = classNameArr.length; i < len; i++) {
        if (!this.hasClass(parent, classNameArr[i])) {
          flag = false;
          break;
        }
      }
      if (flag) {
        return parent;
      } else {
        parent = parent.parentElement;
      }
    }
  },
  /**
   * 获取变量的数据类型
   * @param obj
   * @returns {string|string|"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
   */
  getType: function (obj) {
    var class2type = {};
    if (obj == null) {
      return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
  },
  /**
   * 根据路径从对象中获取值
   * @param obj 对象
   * @param path 路径
   * @returns {*}
   */
  getPropValueByPath: function (obj, path) {
    if (!obj || !path || (path + '').length === 0) {
      return {};
    }
    // 将 'a.b.c["d"].e["f"]' 转换成 'a.b.c.d.e.f'
    path = path.replace(/\["?'?(\w+)"?'?\]/g, '.$1');
    // 将字符的首个"."去除掉
    path = path.replace(/^\./, '');
    // console.log('path', path);
    var pathArr = path.split('.');
    var tempObj = obj;
    var value;
    var key = '';
    while (pathArr.length > 1) {
      key = pathArr.shift();
      tempObj = tempObj[key];
      // console.log('key', key)
      // value = obj[key];
    }

    key = pathArr.shift();
    value = tempObj[key];
    return {
      value,
      lastKey: key,
      parentObj: tempObj
    };
  },
  /**
   * 判断一个变量是否为空值
   * @param variable 变量
   * @returns {boolean}
   */
  varIsNone: function (variable) {
    return variable === null || typeof variable === 'undefined' || (!Array.isArray(variable) && (variable + '').length === 0);
  },
  /**
   * 计算绝对定位元素能完全出现在视口的展示方位
   * @param referenceEl 参照元素
   * @param targetEl 目标元素
   * @param defaultDirection 默认方向，支持top、bottom、left、right
   * @param tryAllDirection 当切换到defaultDirection对应的反方向目标元素也不能完全出现在视口时是否尝试切换其他方向
   */
  calcAbsoluteElementDisplayDirection: function (referenceEl, targetEl, defaultDirection, tryAllDirection = false) {
    if (!referenceEl || !targetEl || !defaultDirection) {
      throw new Error('calcAbsoluteElementDisplayDirection函数确少referenceEl, targetEl, defaultDirection其中的某个参数');
    }
    let rightTailReg = /(\w+)Right$/;
    let bottomTailReg = /(\w+)Bottom$/;
    // 判断方向中是否含有Right
    let defaultDirectionIsRight = false;
    let defaultDirectionIsTop = false;
    if (rightTailReg.test(defaultDirection)) {
      defaultDirection = RegExp.$1;
      defaultDirectionIsRight = true;
    } else if (bottomTailReg.test(defaultDirection)){
      defaultDirection = RegExp.$1;
      defaultDirectionIsTop = true;
    }
    let targetElOffsetParent = targetEl.offsetParent;
    // console.log('targetEl offsetParent', targetEl.offsetParent);
    // 判断目标元素的position不为static的父级元素是否为body
    let targetElOffsetParentIsDocument = !targetElOffsetParent || (targetElOffsetParent.nodeName === 'BODY' || targetElOffsetParent.nodeName === 'HTML');
    let targetElOffsetParentOffset = { top: 0, left: 0 };
    if (!targetElOffsetParentIsDocument) {
      targetElOffsetParentOffset = tool.offset(targetElOffsetParent);
    }
    // console.log('targetElOffsetParentOffset', targetElOffsetParentOffset);
    var referenceOffset = tool.offset(referenceEl);
    // console.log('targetElOffsetParent', targetElOffsetParent, referenceOffset);
    // 判断参照元素是否在position: fixed的元素中
    var referenceIsInFixedPosition = tool.eleIsInFixedParents(referenceEl);
    // console.log('referenceOffset原始的', { ...referenceOffset });
    var referenceRect = referenceEl.getBoundingClientRect();
    var styleDisplay = targetEl.style.display;
    var styleOpacity = targetEl.style.opacity;
    var targetElDisplay = tool.getStyle(targetEl, 'display');
    var targetElIsFixed = tool.getStyle(targetEl, 'position') === 'fixed';
    var needSubtractScrollOffset = true; // 判断元素是否处于滚动容器视口时是否需要减去浏览器滚动条滚动的距离
    // var targetElOpacity = tool.getStyle(targetEl, 'opacity');
    if (referenceIsInFixedPosition) {
      var bodyOverflow = tool.getStyle(document.body, 'overflow');
      if (!targetElIsFixed && targetElOffsetParentIsDocument && bodyOverflow !== 'hidden') {
        // 如果reference元素处于fixed定位的父级容器，并且目标元素处于body元素下且不是fixed定位，则需要加上浏览器滚动条滚动的距离
        referenceOffset.top = referenceOffset.top + tool.scrollTop();
        referenceOffset.left = referenceOffset.left + tool.scrollLeft();
      }
      if (!targetElIsFixed && !targetElOffsetParentIsDocument) {
        needSubtractScrollOffset = true;
      }
    }

    let scrollParent = tool.getScrollParent(referenceEl);
    let referenceElWrapperScrollTop = 0;
    let referenceElWrapperScrollLeft = 0;
    // console.log('getScrollParent', tool.getScrollParent(ele).nodeName);
    // 如果参照元素有滚动条的父级元素并且不是body，则获取参照元素有滚动条的父级元素的滚动条位置
    if (scrollParent && scrollParent.nodeName != 'HTML' && scrollParent.nodeName != 'BODY') {
      // console.log(']]]]]]]]]]]]]]]]]]]]]]]');
      referenceElWrapperScrollTop = tool.scrollTop(scrollParent);
      referenceElWrapperScrollLeft = tool.scrollLeft(scrollParent);
    }
    // console.log('eleWrapperScrollTop, eleWrapperScrollLeft', referenceElWrapperScrollTop, referenceElWrapperScrollLeft);

    // console.log('targetElDisplay', targetElDisplay);
    if (targetElDisplay === 'none') {
      targetEl.style.display = 'block';
      targetEl.style.opacity = '0';
    }
    var targetElRect = targetEl.getBoundingClientRect();
    var targetElTransform = tool.getEleTranslateValue(tool.getStyle(targetEl, 'transform'));
    // console.log('targetElRect', targetElRect, tool.getStyle(targetEl, 'transform'), targetElTransform);
    // 如果dom元素设置了scale的话需要根据当前的宽高计算出元素真正的宽高，否则计算位置会不准确
    targetElRect.width = Math.round(targetElRect.width / Math.abs(targetElTransform.scaleX));
    targetElRect.height = Math.round(targetElRect.height / Math.abs(targetElTransform.scaleY));
    // console.log('计算scale后的宽高', {width: targetElRect.width, height: targetElRect.height});

    var calcedDirection = null;
    var directionCalcFlow = []; // 存储按流程计算方向的函数，当下拉菜单在某个方向上不能完全展示时会自动切换一个方向
    var handleBottom = function (isBottomRight) {
      // 当参照物在有滚动条的容器中且目标元素插入在body时需减去容器滚动条滚动的距离
      var top = referenceOffset.top + referenceRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
      var left = isBottomRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width)) : (referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0));
      // console.log('handleBottom,-----------', referenceOffset.left, targetElRect.width,referenceRect.width);
      var isInView = tool.eleIsInView(targetEl, top, left, needSubtractScrollOffset);
      // console.log('handleBottom isInView', isInView, isBottomRight, (targetElRect.width - referenceRect.width), left);
      return {
        ...isInView,
        direction: isBottomRight ? 'bottomRight' : 'bottom',
        // 计算top值时需减去目标元素position不为static的父级元素的top值
        top: top - targetElOffsetParentOffset.top,
        left: left - targetElOffsetParentOffset.left
      };
    };
    let handleTop = function (isTopRight) {
      // console.log('referenceElWrapperScrollTop', referenceOffset.top, tool.scrollTop(), referenceElWrapperScrollTop);
      var top = referenceOffset.top - targetElRect.height - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0);
      var left = isTopRight ? Math.floor(referenceOffset.left - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0) - (targetElRect.width - referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0))) : referenceOffset.left;
      var isInView = tool.eleIsInView(targetEl, top, left, needSubtractScrollOffset);
      // var bottom = referenceOffset.top - targetElOffsetParentOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) + referenceRect.height;
      var bottom = 0;
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
    let handleLeft = function (isLeftBottom) {
      var top = isLeftBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
      var left = referenceOffset.left - targetElRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);

      var isInView = tool.eleIsInView(targetEl, top, left, needSubtractScrollOffset);
      // console.log('handleTop handleLeft', isInView);
      return {
        ...isInView,
        direction: isLeftBottom ? 'leftBottom' : 'left',
        // 计算top值时需减去目标元素position不为static的父级元素的top值
        top: top - targetElOffsetParentOffset.top,
        left: left - targetElOffsetParentOffset.left
      };
    };
    let handleRight = function (isRightBottom) {
      var top = isRightBottom ? Math.floor(referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0) - (targetElRect.height - referenceRect.height)) : (referenceOffset.top - (targetElOffsetParentIsDocument ? referenceElWrapperScrollTop : 0));
      var left = referenceOffset.left + referenceRect.width - (targetElOffsetParentIsDocument ? referenceElWrapperScrollLeft : 0);

      var isInView = tool.eleIsInView(targetEl, top, left, needSubtractScrollOffset);
      // console.log('handleTop handleRight', isInView);
      return {
        ...isInView,
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
      }

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
      calcedDirection = defaultDirectionResult;
      calcedDirection.isRollback = true;
    }
    // console.log('最终使用的方位：', calcedDirection);
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
  },
  /**
   * 判断对象是否为promise对象
   * @param obj
   * @returns {boolean}
   */
  isPromise (obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  },
  /**
   * 判断浏览器或dom元素是否有滚动条
   * @returns {{horizontal: boolean, vertical: boolean}}
   */
  hasScroll (ele) {
    if (ele && ele.nodeType == 1) {
      return tool.eleHasScroll(ele);
    }
    return {
      // vertical: document.body.offsetWidth < window.innerWidth,
      // horizontal: document.documentElement.clientHeight < window.innerHeight
      vertical: document.body.scrollHeight > window.innerHeight,
      horizontal: document.body.scrollWidth > window.innerWidth
    };
  },
  isFunction (func) {
    return typeof func === 'function';
  }
};
export default tool;
export { tool as util };
