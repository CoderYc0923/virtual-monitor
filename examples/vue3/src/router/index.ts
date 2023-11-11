import {
  createRouter,
  createWebHashHistory,
  // createWebHistory
} from "vue-router";
import { dynamicRouterMap } from "./router.dynamic";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "首页",
      icon: "el-icon-setting",
    },
  },
  {
    path: "/test-range",
    name: "testRange",
    redirect: "/test-range/err",
    component: () => import("@/views/testRange/index.vue"),
    children: dynamicRouterMap,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  scrollBehavior() {
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

export { router as default, dynamicRouterMap };
