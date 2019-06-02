import Vue from 'vue';
import axios from 'axios'
import qs from 'qs'
import store from '@/store'

// axios 配置
const BASE_URL = 'http://dev-kci.ffun360.com/'
const URL = process.env.NODE_ENV === 'production' ? '/' : BASE_URL
const http = axios.create({
  timeout: 60000,
  baseURL: URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const formCofig = {
  timeout: 60000,
  baseURL: URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

// http request 拦截器
http.interceptors.request.use(config => {
  const login = store.state.loginInfo

  if (config.data instanceof FormData) {
    if (login) {
      config.data.append('login_client_id', login.login_client_id)
      config.data.append('login_time', login.login_time)
      config.data.append('login_token', login.login_token)
      config.data.append('session_id', login.session_id)
    }
    return config
  }

  if (login) { // 每个请求都加上token
    const info = qs.stringify(login)
    config.data = config.data ? config.data + '&' + info : info
    return config
  }

  return config
}, err => {
  return Promise.reject(err)
})

const vm = new Vue()

export default {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      http.get(url, {params}).then(res => {
        const code = Number(res.data.errorCode)
        if (code === 0) resolve(res.data)
        else {
          vm.$toast(res.data.errorMessage)
        }
      }).catch(error => {
        vm.$toast('网络出错')
      })
    })
  },
  post(url, params = {}) {
    const location = window.location.href
    return new Promise((resolve, reject) => {
      http.post(url, qs.stringify(params)).then(res => {
        const code = Number(res.data.errorCode)
        if (code === 0) {
          resolve(res.data)
        } else if (code > 0) {
          if (code === 10302) {
            vm.$toast(res.data.errorMessage, true, 3000)
          } else if (code === 401) {
            vm.$toast(res.data.errorMessage, true, 3000)
          } else {
            vm.$toast(res.data.errorMessage)
          }
          vm.$loading(0)
          reject(res.data)
        } else if (code < 0 && location.indexOf("ETPCheck") < 0) {
          vm.$toast('请重新登录')
          vm.$loading(0)
          // store.dispatch('clearUserInfo')
          store.dispatch('clearLoginStore')
            .then(() => window.location.href = URL + 'site/login_out')
          // .then(() => console.log(URL + 'site/login_out'))
        } else {
          vm.$loading(0)
          resolve(res)
        }
      }).catch(error => {
        vm.$toast('网络出错')
        vm.$loading(0)
      })
    })
  },
  form(url, params = {}) {
    return new Promise((resolve, reject) => {
      http.post(url, params, formCofig).then(res => {
        const code = Number(res.data.errorCode)
        if (code === 0) {
          resolve(res.data)
        } else if (code > 0) {
          vm.$loading(0)
          vm.$toast(res.data.errorMessage)
          reject(res.data)
        } else if (code < 0) {
          vm.$loading(0)
          vm.$toast(res.data.errorMessage)
          store.dispatch('clearUserInfo')
          store.dispatch('clearLoginStore')
            .then(() => window.location.href = URL + 'site/login_out')
        } else {
          vm.$toast('网络出错')
          vm.$loading(0)
        }
      }).catch(error => {
        vm.$toast('网络出错')
        vm.$loading(0)
      })
    })
  }
}
