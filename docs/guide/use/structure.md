# 数据说明

上报事件默认数据格式

```js
{
  baseInfo: {
    clientHeight: Number,
    clientWidth: Number,
    colorDepth: Number,
    pixelDepth: Number,
    deviceId: String,
    screenWidth: Number,
    screenHeight: Number,
    vendor: String,
    platform: String,
    userUuid: String,
    sdkUserUuid: String,
    extraInfo: Object,
    appName: String,
    appCode:String,
    pageId: String,
    sessionId: String,
    sdkVersion: String,
    ip: String,
    sendTime: Number
  },
  eventInfo: [
    {
      tti: Number,
      ready: Number,
      loadon: Number,
      firstbyte: Number,
      ttfb: Number,
      trans: Number,
      dom: Number,
      res: Number,
      ssllink: Number,
      triggerPageUrl: String,
      eventType: String,
      eventId: String,
      sendTime: Number
    },
    {
      initiatorType: String,
      transferSize: Number,
      encodedBodySize: Number,
      decodedBodySize: Number,
      duration: Number,
      startTime: Number,
      fetchStart: Number,
      domainLookupStart: Number,
      domainLookupEnd: Number,
      connectStart: Number,
      connectEnd: Number,
      requestStart: Number,
      responseStart:Number,
      responseEnd:Number,
      eventType: String,
      eventId: String,
      requestUrl:String,
      triggerTime: Number,
      triggerPageUrl: String,
      sendTime: Number
    },
    {
      eventType: String,
      eventId: String,
      triggerPageUrl:String,
      referer: String,
      title: String,
      action: String,
      triggerTime: Number,
      sendTime: Number
    }
  ]
}
```

## baseInfo

基础属性，每次上报事件列表都会带上 `baseInfo`

| 属性名       | 说明                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| clientHeight | 网页可见区高度                                                         |
| clientWidth  | 网页可见区宽度                                                         |
| colorDepth   | 显示屏幕调色板的比特深度                                               |
| pixelDepth   | 显示屏幕的颜色分辨率                                                   |
| deviceId     | 设备 ID                                                                |
| screenWidth  | 显示屏幕的宽度                                                         |
| screenHeight | 显示屏幕的高度                                                         |
| vendor       | 浏览器名称                                                             |
| platform     | 浏览器平台的环境,不是电脑系统的 x64 这样的(浏览器平台的环境可能是 x32) |
| userUuid     | 用户 ID                                                                |
| sdkUserUuid  | sdk 内部会根据硬件位置等信息生成一个用户 ID                            |
| extraInfo    | 作为附带对象参数给到服务端                                             |
| appName      | 应用 Name                                                              |
| appCode      | 应用 Code                                                              |
| pageId       | 应用 ID                                                                |
| sessionId    | 会话 ID                                                                |
| sdkVersion   | 插件版本号                                                             |
| ip           | 用户的 IP(可能为空)                                                    |
| sendTime     | 发送时间                                                               |

## eventInfo

::: tip
SDK 采集到的事件信息，不同的事件类型拥有不用的属性，以下仅介绍事件公共属性，私有属性介绍在对应功能下
:::

```ts
/**
 * eventType - 事件触发类型
 */
export enum SEDNEVENTTYPES {
  PV = "pv", // 路由
  ERROR = "error", // 错误
  PERFORMANCE = "performance", // 资源
  CLICK = "click", // 点击
  DWELL = "dwell", // 页面卸载
  CUSTOM = "custom", // 手动触发事件
  INTERSECTION = "intersection", // 曝光采集
}

/**
 * eventID - 触发的事件id
 */
export enum SENDID {
  PAGE = "page", // 页面
  RESOURCE = "resource", // 资源
  SERVER = "server", // 请求
  CODE = "code", // code
  REJECT = "reject", // reject
  CONSOLEERROR = "console.error", // console.error

  // target.nodeName ( 元素名 ps:script, 在html元素上发生异常时会作为eventId )
  // pageId ( 在页面跳转时会带上应用ID作为eventId )
}
```

::: danger
手动调用 traceError() 时不能指定 eventType(error) ,可以指定 eventId

:::
