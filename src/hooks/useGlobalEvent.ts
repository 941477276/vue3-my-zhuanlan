/**
 * 给document、window绑定全局性的事件
 */
import {
  EventCallbackFn
} from '@/ts-tokens/bootstrap';

type EventTarget = 'document' | 'window';
let eventMap = {
  'document': {} as {[key: string]: EventCallbackFn[]},
  'window': {} as {[key: string]: EventCallbackFn[]}
};

export const useGlobalEvent = {
  addEvent: function (target: EventTarget, eventName: string, eventCb: EventCallbackFn): void {
    if (!target || (target != 'document' && target != 'window')) {
      throw new Error('target只支持document、window');
    }
    if (!eventName) {
      throw new Error('缺少事件名称');
    }
    if (!eventCb) {
      throw new Error('缺少事件函数');
    }
    let events = eventMap[target][eventName];
    let eventTarget = target === 'document' ? document : window;
    if (!events) {
      events = eventMap[target][eventName] = [];
      eventTarget.addEventListener(eventName, function (evt: Event) {
        let errors: Error[] = [];
        events.forEach((eventFn: EventCallbackFn) => {
          try {
            eventFn(evt);
          } catch (e) {
            // 捕捉异常
            errors.push(e);
          }
        });
        // 如果有异常则抛出异常
        if (errors.length > 0) {
          errors.forEach((err: Error) => {
            setTimeout(function () {
              throw err;
            }, 0);
          });
        }
      }, false);
    }
    if (!events.includes(eventCb)) {
      events.push(eventCb);
    }
  },
  removeEvent: function (target: EventTarget, eventName: string, eventCb: EventCallbackFn): void {
    let events = eventMap[target][eventName];
    if (!events) {
      return;
    }
    let index = events.indexOf(eventCb);
    if (index > -1) {
      events.splice(index, 1);
    }
  }
};
