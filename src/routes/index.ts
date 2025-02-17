import express, { Router } from "express"
import adminAuth from "./admin/auth.routes"
import userAuth from "./user/auth.routes"
import userManage from "./admin/userManage.routes"
import adminProductManage from "./admin//product.routes"
import userProduct from "./user/product.routes"

const router: Router = express.Router();

const defaultRoutes = [
  {
    path: "/admin/auth",
    route: adminAuth,
  },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path: "/admin/userManage",
    route: userManage,
  },
  {
    path: "/admin/product",
    route: adminProductManage,
  },
  {
    path: "/user/product",
    route: userProduct,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;