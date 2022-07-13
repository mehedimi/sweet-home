import { createRouter, createWebHashHistory } from "vue-router";
import middleware from "@/middleware";
import guest from "@/middleware/guest";
import auth from "@/middleware/auth";

const routes = [
  {
    path: "/",
    redirect: {
      name: "product.index",
    },
  },
  {
    path: "/login",
    component: () => import("./pages/Login.vue"),
    name: "auth.login",
    meta: {
      middlewares: [guest],
    },
  },
  {
    path: "/products",
    component: () => import("./pages/Product/Index.vue"),
    name: "product.index",
    meta: {
      middlewares: [auth],
    },
    children: [
      {
        path: "create",
        component: () => import("./pages/Product/Create.vue"),
        name: "product.create",
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(middleware);

export default router;
