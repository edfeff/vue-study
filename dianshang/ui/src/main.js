// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// 导入样式
import "./assets/css/global.css"
import 'element-ui/lib/theme-chalk/index.css'
import http from './util/http'

Vue.config.productionTip = false

//ele配置
Vue.use(ElementUI);
Vue.prototype.$message = ElementUI.Message

Vue.prototype.$http = http


new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
