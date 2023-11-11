export const dynamicRouterMap = [
  {
    path: "/test-range/err",
    name: "Err",
    component: () => import("@/views/err/index.vue"),
    meta: {
      title: "监控靶场 - 错误监控",
      icon: "el-icon-setting",
    },
  },
  // {
  //   path: '/event',
  //   name: 'Event',
  //   component: () => import('@/views/event/index.vue'),
  //   meta: {
  //     title: '监控 - 点击事件',
  //     icon: 'el-icon-setting'
  //   }
  // },
  // {
  //   path: '/http',
  //   name: 'Http',
  //   component: () => import('@/views/http/index.vue'),
  //   meta: {
  //     title: '监控 - 请求',
  //     icon: 'el-icon-setting'
  //   }
  // },
  // {
  //   path: '/performance',
  //   name: 'Performance',
  //   component: () => import('@/views/performance/index.vue'),
  //   meta: {
  //     title: '监控 - 资源',
  //     icon: 'el-icon-setting'
  //   }
  // },
  // {
  //   path: '/pv',
  //   name: 'Pv',
  //   component: () => import('@/views/pv/index.vue'),
  //   meta: {
  //     title: '监控 - 页面跳转',
  //     icon: 'el-icon-setting'
  //   }
  // },
  // {
  //   path: '/intersection',
  //   name: 'intersection',
  //   component: () => import('@/views/intersection/index.vue'),
  //   meta: {
  //     title: '监控 - 曝光采集',
  //     icon: 'el-icon-setting'
  //   }
  // }
];
