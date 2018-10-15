import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import Axios from 'axios'
import fastclick from 'fastclick'
import './common/less/index'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios
//fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('./components/header/img/logo@2x.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
