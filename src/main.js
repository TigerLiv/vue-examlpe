// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'normalize.css' // 消除浏览器自带的样式
import 'element-ui/lib/theme-chalk/index.css'
import promise from 'babel-polyfill'
import store from './util/store'

Vue.use(Element)
Vue.use(promise)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
