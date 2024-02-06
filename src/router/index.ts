import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import { getUserInfo } from "../utils";
import { useUserStore } from "../store/user";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/welcome",
  },
  {
    path: "/login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/register",
    component: () => import("../pages/Register.vue"),
  },
  {
    path: "/welcome",
    component: () => import("../pages/Welcome.vue"),
  },
  {
    path: "/wenxiu",
    redirect: "/polish",
    component: () => import("../pages/HomePage.vue"),
    meta: { authenticated: true },
    children: [
/*       {
        path: "/case",
        name: "case",
        component: () => import("../pages/Case.vue"),
      }, */
      {
        path: "/polish",
        name: "polish",
        component: () => import("../pages/Polish.vue"),
      },
      {
        path: "/translate",
        name: "translate",
        component: () => import("../pages/Translate.vue"),
      },
      {
        path: "/grammar",
        name: "grammar",
        component: () => import("../pages/Grammar.vue"),
      },
      {
        path: "/account",
        name: "account",
        component: () => import("../pages/Account.vue"),
      },
      {
        path: "/exercise",
        name: "exec",
        component: () => import("../pages/Exercise.vue"),
      },
    ],
  },
];
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.authenticated && !userStore.code) {
    const info = getUserInfo();
    if (new Date().getTime() > new Date(info.expiresAt).getTime()) {
      next("/login");
    }
    userStore.setUserInfo(info);
  }
  next();
});
export default router;