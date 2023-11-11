## 基本说明

### 采集方式

- 自动采集: SKD 内部对浏览器事件做了监听代理，可以自动采集相关信息
- 手动采集: 调用对外暴露的方法手动触发事件采集，见[导出项](../functions/exports.md)

### 发送数据

#### 默认发送

- SDK 内置发送方式为 navigator.sendBeacon > image > xml
  ::: tip
  发送优先级: <br>
  `navigator.sendBeacon` 浏览器支持 `sendBeacon` `且` 发送数据在 `60kb` 以内<br>
  `image` 浏览器不支持 `sendBeacon` `且` 发送数据在 `2kb` 以内<br>
  `xml` 浏览器不支持 `sendBeacon` 发送数据大于 `2kb` `或` 发送数据大于 `60kb` <br>
  :::

#### 自定义发送

- 本地化手动发送(开启 localization 后，手动操作存储在 localStorage 的事件)
- 拦截 SDK 对外暴露的发送事件

## 导出项

SDK 内部导出了大量的 HOOKS 以提高开发自由度，同时也导出了 SDK 内部的 options，可动态更改此对象；具体请查看[导出项](../functions/exports.md)

::: tip
导出的钩子是可以被多页面同时调用的，最后触发的顺序会按照初始化的顺序
:::

例如以下场景:

- 事件信息加密 (beforeSendData 拦截到事件信息后再 return 新的被加密过的对象)
- 发送事件后需交互 (afterSendData)
- 动态更改 dns 上报地址 (操作 options.value.dsn = 'xxxx')
- 等等
