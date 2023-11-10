import { useRef } from "../observer";
import { ObserverValue } from "../observer/types";
import {
  AnyFun,
  InitOptions,
  InternalOptions,
  VoidFun,
} from "../types";
import { deepAssign, typeofAny } from "../utils";
import { logError } from "../utils/debug";
import { isEmpty } from "../utils/is";
import { _support } from "../utils/global";

//全局参数
export class Options implements InternalOptions {
  dns = "";
  appName = "";
  appCode = "";
  appVersion = "";
  userUuid = "";
  sdkUserUuid = "";
  debug = false;
  pv = {
    core: false, //是否自动发送路由添砖相关数据
  };
  performance = {
    core: false, //是否采集静态资源、接口的相关数据
    firstResource: false, //是否采集首次进入页面的数据
    server: false, //接口成功后是否采集接口请求
  };
  error = {
    core: false, // 是否采集异常数据(资源引入错误,promise错误,控制台输出错误)
    server: false, // 是否采集报错接口数据
  };
  event = {
    core: false, // 是否采集点击事件
  };
  // recordScreen = false; //是否启动录屏
  extraInfo = {};
  tracesSampleRate = 1;
  cacheMaxLength = 5;
  cacheWatingTime = 5000;
  ignoreRequest: Array<string | RegExp> = [];
  ignoreErrors = [];
  scopeError = false;
  localization = false;
  sendTypeByXmlBody = false;
  beforePushEventList: AnyFun[] = [];
  beforeSendData: AnyFun[] = [];
  afterSendData: VoidFun[] = [];
  localizationOverFlow: VoidFun = () => {};

  constructor(initOptions: InitOptions) {
    const _options = this.transtionOptions(initOptions);
    _options.ignoreRequest.push(new RegExp(_options.dns));
    deepAssign<Options>(this, _options);
  }

  //对入参进行数据转换
  private transtionOptions(options: InitOptions): Options {
    const _options = deepAssign<Options>({}, this, options);
    const { beforePushEventList, beforeSendData, afterSendData } = options;
    const { pv, performance, error, event } = _options;

    if (typeof pv === "boolean") _options.pv = { core: pv };
    if (typeof performance === "boolean")
      _options.performance = {
        core: performance,
        firstResource: performance,
        server: performance,
      };
    if (typeof error === "boolean")
      _options.error = { core: error, server: error };
    if (typeof event === "boolean") _options.event = { core: event };

    if (beforePushEventList)
      _options.beforePushEventList = [beforePushEventList];
    if (beforeSendData) _options.beforeSendData = [beforeSendData];
    if (afterSendData) _options.afterSendData = [afterSendData];

    return _options;
  }
}

export let options: ObserverValue<InternalOptions>;

//初始化参数
export function initOptions(initOptions: InitOptions): boolean {
  if (!_vaildateMustFill(initOptions) || !_vaildateInitOption(initOptions))
    return false;
  options = useRef(new Options(initOptions));
  _support.options = options;
  return true;
}

//必传参数校验
function _vaildateMustFill(options: InitOptions) {
  const validateList = [
    validateOptionMustFill(options.appName, "appName"),
    validateOptionMustFill(options.dns, "dns"),
  ];
  return validateList.every((res) => !!res);
}

function validateOptionMustFill(target: any, targetName: string): boolean {
  if (isEmpty(target)) {
    logError(`"${targetName}"参数为必填参数`);
    return false;
  }
  return true;
}

function _vaildateInitOption(options: InitOptions) {
  const {
    dns,
    appName,
    appCode,
    appVersion,
    userUuid,
    debug,
    // recordScreen,
    pv,
    performance,
    error,
    event,
    extraInfo,
    tracesSampleRate,
    cacheMaxLength,
    cacheWatingTime,
    ignoreErrors,
    ignoreRequest,
    scopeError,
    localization,
    sendTypeByXmlBody,
    // whiteScreen,
    beforePushEventList,
    beforeSendData,
  } = options;

  const validateFunList = [];

  if (pv && typeof pv === "object")
    validateFunList.push(validateOption(pv.core, "pv.core", "boolean"));
  else validateFunList.push(validateOption(pv, "pv", "boolean"));

  if (performance && typeof performance === "object")
    validateFunList.push(
      validateOption(performance.core, "performance.core", "boolean"),
      validateOption(
        performance.firstResource,
        "performance.firstResource",
        "boolean"
      ),
      validateOption(performance.server, "performance.server", "boolean")
    );
  else
    validateFunList.push(validateOption(performance, "performance", "boolean"));

  if (error && typeof error === "object")
    validateFunList.push(
      validateOption(error.core, "error.core", "boolean"),
      validateOption(error.server, "error.server", "boolean")
    );
  else validateFunList.push(validateOption(error, "error", "boolean"));

  if (event && typeof event === "object")
    validateFunList.push(validateOption(event.core, "event.core", "boolean"));
  else validateFunList.push(validateOption(event, "event", "boolean"));

  const validateList = [
    validateOption(dns, "dns", "string"),
    validateOption(appName, "appName", "string"),
    validateOption(appCode, "appCode", "string"),
    validateOption(appVersion, "appVersion", "string"),
    validateOption(userUuid, "userUuid", "string"),
    validateOption(debug, "debug", "boolean"),
    // validateOption(recordScreen, "recordScreen", "boolean"),

    validateOption(extraInfo, "extraInfo", "object"),
    validateOption(tracesSampleRate, "tracesSampleRate", "number"),

    validateOption(cacheMaxLength, "cacheMaxLength", "number"),
    validateOption(cacheWatingTime, "cacheWatingTime", "number"),

    validateOption(ignoreErrors, "ignoreErrors", "array"),
    validateOptionArray(ignoreErrors, "ignoreErrors", ["string", "regexp"]),

    validateOption(ignoreRequest, "ignoreRequest", "array"),
    validateOptionArray(ignoreRequest, "ignoreRequest", ["string", "regexp"]),

    validateOption(scopeError, "scopeError", "boolean"),
    validateOption(localization, "localization", "boolean"),
    validateOption(sendTypeByXmlBody, "sendTypeByXmlBody", "boolean"),
    // validateOption(whiteScreen, 'whiteScreen', 'boolean'),
    validateOption(beforePushEventList, "beforePushEventList", "function"),
    validateOption(beforeSendData, "beforeSendData", "function"),
  ];

  return (
    validateList.every((res) => !!res) && validateFunList.every((res) => !!res)
  );
}

// 验证选项的类型是否符合要求
function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean | void {
  if (!target || typeofAny(target) === expectType) return true;
  logError(`TypeError: "${targetName}"传入类型错误，需传入【${expectType}】`);
  return false;
}

//验证数组类型属性德校验
function validateOptionArray(
  target: any[] | undefined,
  targetName: string,
  expectTypes: string[]
): boolean | void {
  if (!target) return true
  for (let item of target) {
    if (!expectTypes.includes(typeofAny(item))) {
      logError(`TypeError: "${targetName}"数组项"${item}"传入类型错误，需传入【${typeofAny(item)}】`);
      return false
    }
  }
  return true
}
