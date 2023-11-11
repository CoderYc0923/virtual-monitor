import { defineConfig, DefaultTheme } from "vitepress";
import { version } from "../../package.json";

export default defineConfig({
  lang: "zh-CN",
  title: "virtual-monitor",
  description: "行为埋点 & 性能采集 & 异常采集 & 请求采集 & 路由采集",

  lastUpdated: true,
  base: "/virtual-monitor",
  cleanUrls: true,

  themeConfig: {
    logo: "",

    nav: [
      { text: "指南", link: "/guide/starting" },
      { text: "示例", link: "/guide/use/demo" },
      { text: version, link: "" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [{ text: "快速起步", link: "/guide/starting" }],
        },
        {
          text: "使用",
          items: [
            { text: "基础说明", link: "/guide/use/declare" },
            { text: "配置项", link: "/guide/use/options" },
            { text: "数据说明", link: "/guide/use/structure" },
          ],
        },
        {
          text: "功能",
          items: [{ text: "错误埋点收集", link: "/guide/functions/error" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://gitee.com/ye_chao111/virtual-monitor" },
    ],
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/logo.7k1jidnhjr40.svg",
      },
    ],
  ],
});
