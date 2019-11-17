import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login"
import Home from "@/components/Home"
import http from '@/util/http'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: "/login", component: Login },
    { path: "/", redirect: "/login" },
    {
      path: "/home",
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
      ]
    },
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
        let { data: result } = await http.post(
          "/checkToken"
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
