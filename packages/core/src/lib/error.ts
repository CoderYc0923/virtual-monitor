import { EVENTTYPES, SEDNEVENTTYPES, SENDID } from "../common";
import { eventBus } from "./eventBus";
import { options } from "./options";
import { initBatchError, batchError } from "./batchError";
import { _global } from "../utils/global";
import { isArray, isPromiseRejectedResult, isRegExp } from "../utils/is";
import { useMap, useFilter, getTimestamp, getLocationHref } from "../utils";
import { debug } from "../utils/debug";
import { sendData } from "./sendData";
// import { useZip, getEventList } from "./recordscreen";
// import { RecordEventScope } from '../types'

interface ErrorStack {
  errMessage: string;
  errStack: string;
}

type InstabilityNature = {
  lineNumber: string;
  fileName: string;
  columnNumber: string;
};

//初始化错误埋点监听
function initError() {
  if (!options.value.error.core) return;
  //若开启错误持续监听（开启后会以时间段为范围监听某个错误持续时间）
  if (options.value.scopeError) {
    initBatchError();
    //开启批量错误检测，为防止缓存池内错误丢失，需挂载卸载事件
    eventBus.addEvent({
      type: EVENTTYPES.BEFOREUNLOAD,
      callback: () => {
        console.log("批量错误捕获回调");
        batchError.sendAllCacheError();
      },
    });
  }

  //捕获资源加载错误
  eventBus.addEvent({
    type: EVENTTYPES.ERROR,
    callback: (e: ErrorEvent) => {
      console.log("资源加载错误捕获回调");
      const errorInfo = parseErrorEvent(e);
      if (isIgnoreErrors(errorInfo)) return;
      console.log("资源加载错误捕获回调：errorInfo", errorInfo);
      emit(errorInfo);
    },
  });

  //捕获promise中未处理的reject错误
  eventBus.addEvent({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e: PromiseRejectedResult) => {
      console.log("promise加载错误捕获回调");
      const errorInfo = parseErrorEvent(e);
      if (isIgnoreErrors(errorInfo)) return;
      console.log("promise加载错误捕获回调:errorInfo", errorInfo);
      emit(errorInfo);
    },
  });

  //捕获console.error
  eventBus.addEvent({
    type: EVENTTYPES.CONSOLEERROR,
    callback: (e) => {
      console.log("console.error加载错误捕获回调");
      const errorInfo = parseError(e);
      if (isIgnoreErrors(errorInfo)) return;
      console.log(
        "console.error加载错误捕获回调: errorInfo",
        errorInfo,
        SENDID.CODE
      );
      emit({ eventId: SENDID.CODE, ...errorInfo });
    },
  });
}

//格式化错误事件
function parseErrorEvent(event: ErrorEvent | PromiseRejectedResult) {
  //处理promise reject错误
  if (isPromiseRejectedResult(event))
    return { eventId: SENDID.CODE, ...parseError(event.reason) };
  //处理HTML元素错误
  const { target } = event;
  if (target instanceof HTMLElement) {
    if (target.nodeType === 1) {
      const res = {
        initiatorType: target.nodeName.toLowerCase(),
        eventId: SENDID.RESOURCE,
        requestUrl: "",
      };
      switch (target.nodeName.toLowerCase()) {
        case "link":
          res.requestUrl = (target as HTMLLinkElement).href;
          break;
        default:
          res.requestUrl =
            (target as HTMLImageElement).currentSrc ||
            (target as HTMLScriptElement).src;
      }
      return res;
    }
  }
  //处理代码错误
  if (event.error) {
    // chrome中的error对象没有fileName等属性,需兼容
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return { eventId: SENDID.CODE, ...parseError(e) };
  }
  //处理其余错误
  return {
    eventId: SENDID.CODE,
    line: (_global as any).event.errorLine,
    col: (_global as any).event.errorCharacter,
    errMessage: (_global as any).event.errorMessage,
    triggerPageUrl: (_global as any).event.errorUrl,
  };
}

//分析错误信息
function parseError(e: any) {
  if (e instanceof Error) {
    const { message, stack, lineNumber, fileName, columnNumber } = e as Error &
      InstabilityNature;
    if (fileName)
      return {
        errMessage: message,
        errStack: stack,
        eventId: SENDID.CODE,
        line: lineNumber, //有兼容性问题
        col: columnNumber, //有兼容性问题
        triggerPageUrl: fileName, //有兼容性问题
      };
    return parseStack(e);
  }
  if (e.message) return parseStack(e);

  if (typeof e === "string") return { eventId: SENDID.REJECT, errMessage: e };

  if (isArray(e))
    return { eventId: SENDID.CONSOLEERROR, errMessage: e.join(";") };

  return {};
}

//格式化错误对象信息
function parseStack(err: Error): ErrorStack {
  const { stack = "", message = "" } = err;
  const result = { eventId: SENDID.CODE, errMessage: message, errStack: stack };

  if (stack) {
    const rChromeCallStack = /^\s*at\s*([^(]+)\s*\((.+?):(\d+):(\d+)\)$/;
    const rMozlliaCallStack = /^\s*([^@]*)@(.+?):(\d+):(\d+)$/;
    // chrome中包含了message信息,将其去除,并去除后面的换行符
    const callStackStr = stack.replace(
      new RegExp(`^[\\w\\s:]*${message}\n`),
      ""
    );
    const callStackFrameList = useMap(
      useFilter(callStackStr.split("\n"), (item: string) => item),
      (str: string) => {
        const chromeErrResult = str.match(rChromeCallStack);
        if (chromeErrResult) {
          return {
            triggerPageUrl: chromeErrResult[2],
            line: chromeErrResult[3], // 错误发生位置的行数
            col: chromeErrResult[4], // 错误发生位置的列数
          };
        }

        const mozlliaErrResult = str.match(rMozlliaCallStack);
        if (mozlliaErrResult) {
          return {
            triggerPageUrl: mozlliaErrResult[2],
            line: mozlliaErrResult[3],
            col: mozlliaErrResult[4],
          };
        }
        return {};
      }
    );
    const item = callStackFrameList[0] || {};
    return { ...result, ...item };
  }
  return result;
}

//判断错误信息是否需要拦截
function isIgnoreErrors(error: any): boolean {
  if (!options.value.ignoreErrors.length) return false;
  let errMessage = error.errMessage || error.message;
  if (!errMessage) return false;
  errMessage = String(errMessage);

  return options.value.ignoreErrors.some((item) => {
    if (isRegExp(item)) {
      if ((item as RegExp).test(errMessage)) {
        debug(`通过拦截条件：(${item})已将错误：${errMessage}拦截`);
        return true;
      }
      return false;
    } else {
      if (errMessage === item) {
        debug(`通过拦截条件：(${item})已将错误：${errMessage}拦截`);
        return true;
      }
      return false;
    }
  });
}

//发送错误事件信息
function emit(errorInfo: any, flush = false) {
  console.log("emit:info", "enter");
  const info = {
    ...errorInfo,
    eventType: SEDNEVENTTYPES.ERROR,
    // recordscreen: options.value.recordScreen ? useZip(getRecordEvent()) : null,
    triggerPageUrl: getLocationHref(),
    triggerTime: getTimestamp(),
  };
  console.log("emit:info", info);
  options.value.scopeError
    ? batchError.pushCacheErrorA(info)
    : sendData.emit(info, flush);
}

//主动触发错误上报
function handleSendError(options = {}, flush = false) {
  console.log("handleSendError", options);
  emit(options, flush);
}

//获取错误录屏数据
// function getRecordEvent(): RecordEventScope[] {
//   const _recordscreenList: RecordEventScope[] = JSON.parse(
//     JSON.stringify(getEventList())
//   );
//   return _recordscreenList
//     .slice(-2)
//     .map((item) => item.eventList)
//     .flat();
// }

export { initError, parseError, handleSendError };
