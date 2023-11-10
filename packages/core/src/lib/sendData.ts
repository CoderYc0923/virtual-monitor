import { SDK_LOCAL_KEY } from "../common";
import { useComputed } from "../observer";
import { AnyObj } from "../types";
import {
  getTimestamp,
  useMap,
  executeFunctions,
  typeofAny,
  sendByBeacon,
  sendByImage,
  sendByXML,
  useNextTick,
  randomBoolean,
} from "../utils";
import { debug, logError } from "../utils/debug";
import { _global, _support } from "../utils/global";
import { isArray, isFalse, isObject, isObjectOverSizeLimit } from "../utils/is";
import { LocalStorageUtil } from "../utils/localStorage";
import { refreshSession } from "../utils/session";
import { baseInfo } from "./base";
import { options } from "./options";

export class SendData {
  private events: AnyObj[] = []; //批次队列
  private timeoutId: NodeJS.Timeout | undefined; //延迟发送ID

  //发送事件列表
  private send() {
    console.log("sednDaTa:send:", this.events);
    if (!this.events.length) return;
    const sendEvents = this.events.splice(0, options.value.cacheMaxLength); //需要发送的事件
    this.events = this.events.slice(options.value.cacheMaxLength); //剩下未发送的事件
    console.log("send:", sendEvents);

    const time = getTimestamp();
    const sendParams = useComputed(() => ({
      baseInfo: {
        ...baseInfo.base?.value,
        sendTime: time,
        userUuid: options.value.userUuid,
      },
      eventInfo: useMap(sendEvents, (e: any) => {
        e.sendTime = time;
        return e;
      }),
    }));

    //若开启本地化localization，则拦截
    if (options.value.localization) {
      const success = LocalStorageUtil.setSendDataItem(
        SDK_LOCAL_KEY,
        sendParams.value
      );
      //若本地化溢出
      if (!success) options.value.localizationOverFlow(sendParams.value);
      return;
    }

    const afterSendParams = executeFunctions(
      options.value.beforeSendData,
      false,
      sendParams.value
    );
    if (isFalse(afterSendParams)) return;
    if (!this.validateObject(afterSendParams, "beforeSendData")) return;

    debug("send events", sendParams.value);

    this.executeSend(options.value.dns, afterSendParams).then((res: any) => {
      executeFunctions(options.value.afterSendData, true, {
        ...res,
        params: afterSendParams,
      });
    });

    //若一次性发送事件溢出,剩余的事件会在合适的时机发送，不会等到下一次队列
    if (this.events.length) {
      useNextTick(this.send.bind(this));
    }
  }

  //记录需要发送的埋点数据
  public emit(e: AnyObj, flush = false) {
    console.log("发送错误:emit", e, _support);
    if (!e) return;
    if (!_support.lineStatus.online) return;
    console.log(
      "发送错误:_support.lineStatus.online",
      _support.lineStatus.online
    );
    if (!flush && !randomBoolean(options.value.tracesSampleRate)) return;
    console.log(
      "发送错误:randomBoolean",
      randomBoolean(options.value.tracesSampleRate)
    );
    if (!isArray(e)) e = [e];
    // console.log('发送错误:emit', e);

    const eventList = executeFunctions(
      options.value.beforePushEventList,
      false,
      e
    );

    console.log("发送错误:emit-eventList", eventList);
    if (isFalse(eventList)) return;
    if (!this.validateObject(eventList, "beforePushEventList")) return;

    this.events = this.events.concat(eventList);
    console.log("发送错误:emit-events", eventList);
    refreshSession();
    if (this.timeoutId) clearTimeout(this.timeoutId);
    //满足最大记录数就立即发送，不然就定时发送

    if (this.events.length >= options.value.cacheMaxLength || flush)
      this.send();
    else
      this.timeoutId = setTimeout(
        this.send.bind(this),
        options.value.cacheWatingTime
      );
  }

  //验证选项的类型([]、{})
  private validateObject(target: any, targetName: string): boolean | void {
    if (target === false) return false;
    if (!target) {
      logError(`NullError: ${targetName}返回值不能为空`);
      return false;
    }
    const typeArr = ["object", "array"];
    if (typeArr.includes(typeofAny(target))) return true;
    logError(`TypeError: ${targetName}需为"{}" or "[]"类型`);
    return false;
  }

  private setSendType(data: any): number {
    let sendType = 1;
    if (options.value.sendTypeByXmlBody)
      sendType = 3; //开启强制使用xml body方式发送
    else if (_global.navigator)
      sendType = isObjectOverSizeLimit(data, 60) ? 3 : 1;
    //使用sendBeacon 最大64kb
    else sendType = isObjectOverSizeLimit(data, 2) ? 3 : 2; //使用img 最大2kb
    return sendType;
  }

  //发送数据
  private executeSend(url: string, data: any) {
    let sendType = this.setSendType(data);
    return new Promise((resolve) => {
      switch (sendType) {
        case 1:
          resolve({ sendType: "sendBeacon", success: sendByBeacon(url, data) });
          break;
        case 2:
          sendByImage(url, data).then(() => {
            resolve({ sendType: "image", success: true });
          });
          break;
        case 3:
          sendByXML(url, data).then(() => {
            resolve({ sendType: "xml", success: true });
          });
          break;
      }
    });
  }
}

export let sendData: SendData;

export function initSendData() {
  _support.sendData = new SendData();
  sendData = _support.sendData;
}
