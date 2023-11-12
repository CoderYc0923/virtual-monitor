import { defineConfig, DefaultTheme } from "vitepress";
import { version } from "../../package.json";

export default defineConfig({
  lang: "zh-CN",
  title: "virtual-monitor",
  description: "行为埋点 & 性能采集 & 异常采集 & 请求采集 & 路由采集",

  lastUpdated: true,
  base: "/virtual-monitor-docs/",
  cleanUrls: true,

  themeConfig: {
    logo: "https://raw.githubusercontent.com/CoderYc0923/image-bed/images/images/slogin.svg",

    nav: [
      { text: "指南", link: "/guide/starting" },
      {
        text: "示例",
        link: "https://github.com/CoderYc0923/virtual-monitor-vue3-example",
      },
      { text: `v${version}`, link: "" },
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
      {
        icon: "github",
        link: "https://github.com/CoderYc0923/virtual-monitor",
      },
    ],
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://raw.githubusercontent.com/CoderYc0923/image-bed/images/images/slogin.svg",
      },
    ],
  ],
});
