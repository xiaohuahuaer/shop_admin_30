import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/base.css'
import ElTreeGrid from 'element-tree-grid'

import axios from 'axios'
Vue.prototype.axios = axios

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 配置axios的请求拦截器
axios.interceptors.request.use(
  function(config) {
    // console.log('此路是我开', config)
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 配置axios的响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    // console.log('拦截到响应了', res)
    // 直接res中的data进行返回
    return res
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.component('el-table-tree-column', ElTreeGrid)
// ElTreeGrid.name = 'el-table-tree-column'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
