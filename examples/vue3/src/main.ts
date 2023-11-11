import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VirtualMonitor from "@virtual-monitor/vue3";
import router from "./router";
import "./assets/global.scss";
import "animate.css";
import initComponents from "./components/index";
import { ElNotification } from "element-plus";

const app = createApp(App);

const sendEventType: any = {
  pv: "路由",
  error: "错误",
  performance: "资源",
  click: "点击",
  dwell: "页面卸载",
  intersection: "曝光采集",
};

const initOptions = {
  dns: "/trackweb",
  appName: "yc",
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  scopeError: true,

  // 查询埋点信息、清除埋点信息、获取埋点基础信息 不需要进行捕获
  ignoreRequest: [
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/,
  ],

  // 发送埋点数据后，拉起弹窗提示用户已发送
  afterSendData(data: any) {
    const { sendType, success, params } = data;
    const message = `
      <div class='event-pop'>
        <div class='warning-text'>详请可见控制台</div>
        <div>发送是否成功: ${success}</div>
        <div>发送方式: ${sendType}</div>
        <div>发送概要
          ${params.eventInfo.reduce(
            (pre: string, item: any, index: number) => {
              pre += `
              <div class='pop-line'>
                <span>${index + 1}</span>
                <div>${item.eventType}(${sendEventType[item.eventType]})</div>
                <div>${item.eventId}</div>
              </div>`;
              return pre;
            },
            `<div class='pop-line'>
              <div>eventType</div>
              <div>eventId</div>
            </div>`
          )}
        </div>
      </div>
    `;
    ElNotification({
      title: "埋点数据已上报至服务端",
      message,
      position: "top-right",
      dangerouslyUseHTMLString: true,
    });
    // @ts-ignore
    if (window.getAllTracingList) {
      //若直接调用获取接口,可能会出现上报接口比获取接口慢的情况而导致获取接口304导致数据不能及时更新
      setTimeout(() => {
        // @ts-ignore
        window.getAllTracingList();
      }, 0);
    }
  },
};

app.use(VirtualMonitor, initOptions);

app.use(router);
app.use(initComponents);
app.use(ElementPlus);
app.mount("#app");
