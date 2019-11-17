import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login"
import Home from "@/components/Home"
Vue.use(Router)

const router = new Router({
  routes: [
    { path: "/login", component: Login },
    { path: "/home", component: Home },
    { path: "/", redirect: "/login" },
  ]
})

//路由导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (to.path === '/login') {
    return next();
  } else {
    let token = window.sessionStorage.getItem("token");
    if (!token) {
      return next('/login');
    } else {
      //服务器校验 token 有效性
      (async () => {
        let { data: result } = await Vue.prototype.$http.post(
          "/checkToken?token=" + token
        );
        if (result.meta.status !== 200) {
          return next('/login')
        } else {
          return next();
        }
      })();
    }
  }
})
export default router
