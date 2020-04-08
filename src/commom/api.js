import axios from 'axios'
import {Loading} from 'element-ui'
import msgBoxErr from './msgbox-err'
import {urlMatcher} from './util.js'
import router from '../router.js'
import qs from 'qs'

axios.defaults.baseURL = myConfig.baseUrl;

const loadingInstances = {}
export const http = axios.create({
  /*baseURL: 'http://25.30.9.9',*/
  timeout: 20000,
  transformRequest: [(data, headers) => {
    if (data && headers['Content-Type'] && ~headers['Content-Type'].indexOf('x-www-form-urlencoded')) {
      return qs.stringify(data)
    } else if (data && headers['Content-Type'] && ~headers['Content-Type'].indexOf('application/json')) {
      return JSON.stringify(data)
    }
    return data
  }],
  operation: false
})

function closeLoading(url) {
  const loadingInstance = loadingInstances[url]
  if (loadingInstance) {
    loadingInstance.close()
    delete loadingInstances[url]
  }
}

//http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
http.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
http.interceptors.request.use(async config => {
  //config.headers.common['Authorization'] = 'Bearer 8c140346-07dc-4bbd-8d2f-6a32ac419da6'
  if (sessionStorage.getItem("token") && !config.headers.common['Authorization']) {
    config.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem("token")
  }

  config.url = urlMatcher(config.url, config.pathParams)
  if (config.loadingMaskTarget) {
    const loadingUrl = config.baseURL + config.url
    closeLoading(loadingUrl)
    loadingInstances[loadingUrl] = Loading.service({
      target: config.loadingMaskTarget
    })
  }
  return config
})

http.interceptors.response.use(res => {
  http.defaults.operation = true
  closeLoading(res.config.url)
  const data = res.data
  if (!data.code || data.code === 0) {
    return res
  } else if (res.config.noAlert) {
    return Promise.reject(res)
  } else {
    msgBoxErr(data.msg || '请求失败！', data.code)
  }
  return Promise.reject(res)
}, err => {
  err.config && closeLoading(err.config.url)
  if (err.response) {
    const status = err.response.status
    //token失效
    if (status === 401) {
      sessionStorage.setItem('user', null)
      sessionStorage.setItem('token', '')
      sessionStorage.setItem('authorities', null)
      router.push({
        name: 'login',
        query: {redirect: router.history.current.name !== 'login' ? encodeURIComponent(router.history.current.fullPath) : ''}
      })
      return Promise.reject(err)
    }
    if (err.response.data.error === 'invalid_grant') {
      msgBoxErr('密码错误', status)
      return Promise.reject(err)
    }
    msgBoxErr(err.response.data ? (
      err.response.data.descript ||
      err.response.data.msg ||
      err.response.data.error ||
      err.response.data.message ||
      err.response.data ||
      '抱歉，服务器忙！') : '抱歉，服务器忙！', status)
    return Promise.reject(err)
  }
  msgBoxErr(err.message.indexOf('timeout') > -1 ? '请求超时' : '抱歉，服务器忙！', 'SERVER')
  return Promise.reject(err)
})

const apis = require.context('../views', true, /api\.js$/)

const apiMap = {}
const apiPaths = []
apis.keys().forEach(api => {
  apis(api).default.forEach(v => {
    if (apiMap[v.name]) throw new Error(`${v.name}的API名称重复`)
    if (apiPaths.find(v => v === v.url)) throw new Error(`${v.url}接口路径重复`)
    apiMap[v.name] = {}
    apiPaths.push(v.url)
    if (!Array.isArray(v.methods)) throw new Error(`${v.name}的methods不是数组`)
    v.methods.forEach(m => {
      apiMap[v.name][m] = (data, config) => (m === 'get' || m === 'delete') ? http[m](v.url, {params: data, ...config}) : http[m](v.url, data, config)
    })
  })
})

export default apiMap
