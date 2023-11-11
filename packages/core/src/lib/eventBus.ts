import type { AnyFun } from "../types";
import { EVENTTYPES } from "../common";
import { _support } from "../utils/global";

interface EventHandler {
  type: EVENTTYPES;
  callback: AnyFun;
}

type Handlers = {
  [key in EVENTTYPES]?: AnyFun[];
};

export class EventBus {
  private handlers: Handlers;
  constructor() {
    this.handlers = {};
  }

  //为目标类型事件添加回调
  addEvent(handler: EventHandler) {
    !this.handlers[handler.type] && (this.handlers[handler.type] = []);
    const funIndex = this._getCallbackIndex(handler);
    if (funIndex === -1) this.handlers[handler.type]?.push(handler.callback);
  }

  //为目标类型事件删除回调
  delEvent(handler: EventHandler, newCallback: AnyFun) {
    const funIndex = this._getCallbackIndex(handler);
    if (funIndex === -1)
      this.handlers[handler.type]?.splice(funIndex, 1, newCallback);
  }

  //获取目标类型事件的所有回调
  getEvent(type: EVENTTYPES): AnyFun[] {
    return this.handlers[type] || [];
  }

  //执行目标类型事件所有回调
  runEvent(type: EVENTTYPES, ...args: any[]): void {
    const allEvent = this.getEvent(type);
    allEvent.forEach((fun) => {
      fun(...args);
    });
  }

  //获取函数在callback列表中的位置
  private _getCallbackIndex(handler: EventHandler): number {
    if (this.handlers[handler.type]) {
      const callbackList = this.handlers[handler.type];
      if (callbackList)
        return callbackList.findIndex((fun) => fun === handler.callback);
      else return -1;
    }
    {
      return -1;
    }
  }
}

const eventBus = _support.eventBus || (_support.eventBus = new EventBus());

export { eventBus };
