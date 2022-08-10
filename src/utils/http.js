import axios from 'axios'
import { store } from '../redux/store'
axios.defaults.baseURL = "http://localhost:5000"

// axios.defaults.headers

// 发起请求拦截之前
axios.interceptors.request.use(function (config) {
  // 显示loading
  store.dispatch({
    type: 'change_loading',
    payload: true
  })
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应之后的
axios.interceptors.response.use(function (response) {
  //成功隐藏loading
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return response
}, function (error) {
  //失败也要隐藏loading
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return Promise.reject(error)
})
