import { EVENTTYPES } from "../common";
import { VoidFun } from "../types";
import { getTimestamp, isValidKey, on, replaceAop, throttle } from "../utils";
import { _global } from "../utils/global";
import { eventBus } from "./eventBus";

//初始化重写 监听
export function initReplace() {
  for (const key in EVENTTYPES) {
    if (isValidKey(key, EVENTTYPES)) replace(key);
  }
}

function replace(type: EVENTTYPES) {
  if (!isValidKey(type, EVENTTYPES)) return;
  const value = EVENTTYPES[type];
  switch (value) {
    case EVENTTYPES.ERROR:
      listenError(EVENTTYPES.ERROR);
      break;
    case EVENTTYPES.UNHANDLEDREJECTION:
      listenUnhandledrejection(EVENTTYPES.UNHANDLEDREJECTION);
      break;
    case EVENTTYPES.CONSOLEERROR:
      replaceConsoleError(EVENTTYPES.CONSOLEERROR);
      break;
    case EVENTTYPES.CLICK:
      listenClick(EVENTTYPES.CLICK);
      break;
    case EVENTTYPES.LOAD:
      listenLoad(EVENTTYPES.LOAD);
      break;
    case EVENTTYPES.BEFOREUNLOAD:
      listenBeforeunload(EVENTTYPES.BEFOREUNLOAD);
      break;
    case EVENTTYPES.XHROPEN:
      replaceXHROpen(EVENTTYPES.XHROPEN);
      break;
    case EVENTTYPES.XHRSEND:
      replaceXHRSend(EVENTTYPES.XHRSEND);
      break;
    case EVENTTYPES.FETCH:
      replaceFetch(EVENTTYPES.FETCH);
      break;
    case EVENTTYPES.HASHCHANGE:
      listenHashchange(EVENTTYPES.HASHCHANGE);
      break;
    case EVENTTYPES.HISTORYPUSHSTATE:
      replaceHistoryPushState(EVENTTYPES.HISTORYPUSHSTATE);
      break;
    case EVENTTYPES.HISTORYREPLACESTATE:
      replaceHistoryReplaceState(EVENTTYPES.HISTORYREPLACESTATE);
      break;
    case EVENTTYPES.POPSTATE:
      listenPopState(EVENTTYPES.POPSTATE);
      break;
    case EVENTTYPES.OFFLINE:
      listenOffline(EVENTTYPES.OFFLINE);
      break;
    case EVENTTYPES.ONLINE:
      listenOnline(EVENTTYPES.ONLINE);
      break;
    default:
      break;
  }
}

//监听error

function listenError(type: EVENTTYPES) {
  on(
    _global,
    "error",
    (e: ErrorEvent) => {
      eventBus.runEvent(type, e);
    },
    true
  );
}

//监听unhandledrejection promise异常
function listenUnhandledrejection(type: EVENTTYPES) {
  on(_global, "unhandledrejection", (ev: PromiseRejectionEvent) => {
    eventBus.runEvent(type, ev);
  });
}

//监听click
function listenClick(type: EVENTTYPES) {
  if (!("document" in _global)) return;
  const clickThrottle = throttle(eventBus.runEvent, 100, true);
  on(
    _global.document,
    "click",
    function (this: any, e: MouseEvent) {
      clickThrottle.call(eventBus, type, e);
    },
    true
  );
}

//监听load
function listenLoad(type: EVENTTYPES) {
  on(
    _global,
    "load",
    (e: Event) => {
      eventBus.runEvent(type, e);
    },
    true
  );
}

//监听beforeunload
function listenBeforeunload(type: EVENTTYPES) {
  on(
    _global,
    "beforeunload",
    (e: BeforeUnloadEvent) => {
      eventBus.runEvent(type, e);
    },
    false
  );
}

//监听hashchange
function listenHashchange(type: EVENTTYPES) {
  on(_global, "hashchange", (e: HashChangeEvent) => {
    eventBus.runEvent(type, e);
  });
}

//监听popstate
function listenPopState(type: EVENTTYPES) {
  on(_global, "popstate", function (e: HashChangeEvent) {
    eventBus.runEvent(type, e);
  });
}

//监听offline 网络是否关闭
function listenOffline(type: EVENTTYPES) {
  on(
    _global,
    "offline",
    function (e: ErrorEvent) {
      eventBus.runEvent(type, e);
    },
    true
  );
}
//监听online 网络是否开启
function listenOnline(type: EVENTTYPES) {
  on(
    _global,
    "online",
    function (e: ErrorEvent) {
      eventBus.runEvent(type, e);
    },
    true
  );
}

//重写console.error
function replaceConsoleError(type: EVENTTYPES) {
  replaceAop(console, "error", (originalError: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      console.log("replaceConsoleError", args, originalError, this);

      if (
        !(
          args[0] &&
          args[0].slice &&
          args[0].slice(0, 12) === "@virtual-monitor"
        )
      )
        eventBus.runEvent(type, args);
      originalError.apply(this, args);
    };
  });
}

//重写XHR-open
function replaceXHROpen(type: EVENTTYPES) {
  if (!("XMLHttpRequest" in _global)) return;
  replaceAop(XMLHttpRequest.prototype, "open", (originalOpen: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args);
      originalOpen.apply(this, args);
    };
  });
}

//重写XHR-send
function replaceXHRSend(type: EVENTTYPES) {
  if (!("XMLHttpRequest" in _global)) return;
  replaceAop(XMLHttpRequest.prototype, "send", (originalSend: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args);
      originalSend.apply(this, args);
    };
  });
}

//重写fetch
function replaceFetch(type: EVENTTYPES) {
  if (!("fetch" in _global)) return;
  replaceAop(_global, "fetch", (originalFetch) => {
    return function (this: any, ...args: any[]): void {
      const fetchStart = getTimestamp();
      return originalFetch.apply(_global, args).then((res: any) => {
        eventBus.runEvent(type, ...args, res, fetchStart);
        return res;
      });
    };
  });
}

//重写history-replaceState
function replaceHistoryReplaceState(type: EVENTTYPES) {
  if (!("history" in _global)) return;
  if (!("pushState" in _global.history)) return;
  replaceAop(
    _global.history,
    "replaceState",
    (originalReplaceState: VoidFun) => {
      return function (this: any, ...args: any[]): void {
        eventBus.runEvent(type, ...args);
        originalReplaceState.apply(this, args);
      };
    }
  );
}

//重写history-pushState
function replaceHistoryPushState(type: EVENTTYPES) {
  if (!("history" in _global)) return;
  if (!("pushState" in _global.history)) return;
  replaceAop(_global.history, "pushState", (originalPushState: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args);
      originalPushState.apply(this, args);
    };
  });
}
