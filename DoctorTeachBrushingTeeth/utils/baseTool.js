
const baseURL = require('/baseURL.js')

// 获得状态
let baseState = baseURL.baseState
// 系统信息
let systemInfo = wx.getSystemInfoSync()
// 品牌名称
let brand = String(systemInfo.brand).toLowerCase()
// 是否模拟器
let isSimulator = (brand == 'devtools')
/**
 * e 是要打印的参数
 */
function print(e) {
  // 测试环境下或者模拟器状态下, 才输入内容到控制台
  console.log(e)
  if (baseState || isSimulator) {
    // 打印内容
    console.log(e)
  } 
}

/**
 * 通过指定的 key 获取 value
 */
function valueForKey(key = '') {
  return wx.getStorageSync(key)
}

/**
 * 设置键值对
 * value 是要设置的值
 * key 是存储在本地缓存里对应的键
 */
function setValueForKey(value, key = '') {
  wx.setStorageSync(key, value)
}

/**
 * 删除指定键值对
 */
function removeObjectForKey(key = '') {
  wx.removeStorageSync(key)
}

/**
 * 删除所有对象
 */
function removeAllObjects () {
  wx.clearStorageSync()
}

/**
 * 震动
 */
function vibrate() {
  let that = this
  wx.vibrateLong({
    success: function (res) {
      that.print(res)
    },
    fail: function (res) {
      that.print(res)
    }
  })
}

/**
 * 默认的 Promise, 不会 resolve 也不会 reject
 */
function defaultPromise() {
  return new Promise((resolve, reject) => {})
}

/**
 * 默认的 Then Promise, 会 resolve
 */
function defaultThenPromise() {
  return new Promise((resolve, reject) => {resolve()})
}

/**
 * 将 thenPromise 绑定到主 Promise 的 then
 * @parma masterPromise 是父 Promise, 一般是函数调用产生的
 * @param thenPromise 是对应的 Promise 的名字, 不会发生提前调用, 注意传参
 */
function bindThenPromise(masterPromise = defaultThenPromise(), thenPromise = defaultThenPromise) {
  return masterPromise.then(res => {
    return thenPromise()
  }).catch(res => {
    return defaultPromise()
  })
}

/**
 * 将 catchPromise 绑定到主 Promise 的 catch
 * @parame catchPromise 是 catchPromise对应函数的名字, 不会发生提前调用
 */
function bindCatchPromise(masterPromise = defaultPromise(), catchPromise = defaultPromise) {
  return masterPromise.then(res => {
    return defaultPromise()
  }).catch(res => {
    return catchPromise()
  })
}

function setValueForKeyAsync(value, key) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

function valueForKeyAsync(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

/**
 * 获取系统信息
 */
function getSystemInfo() {
  wx.getSystemInfoSync()
}

/**
 * 获取系统信息, 异步
 */
function getSystemInfoAsync() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function startTimer(callback = (total) => { }, inteval = 1000, total = 0) {
  let that = this
  let stop = callback(total)
  if (stop == true) {
    return
  } else {
    // 自减1
    total--
    // 定时器
    setTimeout(function () {
      startTimer(callback, inteval, total)
    }, inteval)
  }
}

function getCurrentTime() {
  let date = new Date();
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')
  let second = zeroFormat(date.getSeconds() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

function getCurrentTimeWithoutSecond() {
  let date = new Date();
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

function getNextMinuteTimeWithZeroSecond() {
  let date = new Date();
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":00"
}

function getNextMinuteTimeWithZeroSecond() {
  let date = new Date();
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":00"
}


function getNextMinuteTimeWithNoDateZeroSecond() {
  let date = new Date();
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')
  return hour + ':' + minute
}

function getCurrentDateWithoutTime() {
  let date = new Date();
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day
}

/**
 * 加 0 格式化字符串
 */
function zeroFormat(oldString = '') {
  return oldString.length == 1 ? '0' + oldString : oldString
}

function values(obj) {
  let vals = [], key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
}
/**
 * showInfo: 只用来展示信息
 */
function showInfo(info = '') {
  wx.showModal({
    title: '提示',
    content: info,
    showCancel: false,
    confirmText: '好的',
    confirmColor: '#00a0e9',
  })
}

/**
 * 模型转换适配器
 * model 待转换的模型, key 是我们需要的 key, value 是转换对应的 key
 * value 是转换之前的键值对
 */
function modelAdapter(model = {}, value = {}) {
  // if (!value) {
  //   return
  // }
  // 遍历模型
  let keys = Object.keys(model)
  for (let index = 0; index < keys.length; ++index) {
    // 获得新 key
    let key = keys[index]
    let newkey = model[key]
    // 在值中查找新 key 对应的值
    if (value[newkey]) {
      // 获得新值
      model[key] = value[newkey]
    }
  }
}

/**
 * 统一处理网络请求
 * url 请求地址
 * data 是请求参数
 */
function request(url = '', data = {}) {
  return new Promise((resolve, reject) => {
    print([url, data])
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        print(res)
        if (res.data.code == 'success') {
          resolve(res.data.data)
        } else if (res.data.msg){
          reject(res.data.msg)
        } else {
          reject('网络有点点问题')
        }
      },
      fail: function (res) {
        reject('网络有点点问题')
      },
    })
  })
}

/**
 * 从 URL 中提取参数, url 是完成的 url 字符串
 */
function getParameterFromURL(url = '') {
  decodeURI(url)
  // 是否包含问号
  if (url.indexOf('?')) {
    // 切割 url 地址和参数
    let allComponents = url.split('?')
    if (allComponents.length == 2) {
      // 获得参数部分字符串
      let parameterString = allComponents[1]
      // 通过 & 字符串切割成键值字符串数组
      let allParameters = parameterString.split('&')
      let parameterData = {}
      // 遍历该数组
      for(let index = 0; index < allParameters.length; ++index) {
        let param = allParameters[index]
        if (param.indexOf('=')) {
          // 通过 = 字符串切割成 key 和 value
          let keyValues = param.split('=')
          if (keyValues.length == 2) {
            let key = keyValues[0]
            let value = keyValues[1]
            // 生成 key 对应的 value
            parameterData[key] = value
          }
        }
      }
      return parameterData
    }
  }
  return null
}

// 添加接口
module.exports = {
  // 打印
  print: print,
  // 模拟器
  isSimulator: isSimulator,
  // 系统信息
  systemInfo: systemInfo,
  // 获取键值对
  valueForKey: valueForKey,
  valueForKeyAsync: valueForKeyAsync,
  // 设置键值对
  setValueForKey: setValueForKey,
  setValueForKeyAsync: setValueForKeyAsync,
  // 删除指定键值对
  removeObjectForKey: removeObjectForKey,
  // 清空缓存
  removeAllObjects: removeAllObjects,
  // 获取系统信息
  getSystemInfo: getSystemInfo,
  // 异步获取系统信息
  getSystemInfoAsync: getSystemInfoAsync,
  // 震动
  vibrate: vibrate,
  getNet: function () {
    let that = this
    wx.onNetworkStatusChange(function(res){
      that.print(res)
      wx.showModal({
        title: '网络改变',
        content: res.networkType,
      })
    })
  },
  // 默认 Promise
  defaultPromise: defaultPromise,
  // 默认 then Promise
  defaultThenPromise: defaultThenPromise,
  // 绑定 then Promise 到 master Promise
  bindThenPromise: bindThenPromise,
  // 绑定 catch Promise 到 master Promise
  bindCatchPromise: bindCatchPromise,
  // 网络失败提示
  errorMsg: '网络错误',
  // 启动定时器功能
  startTimer: startTimer,
  // 获取当前时间
  getCurrentTime: getCurrentTime,
  // 获取当前时间, 时分, 无秒
  getCurrentTimeWithoutSecond: getCurrentTimeWithoutSecond,
  // 获取从下一分钟从0秒钟开始的时间
  getNextMinuteTimeWithZeroSecond: getNextMinuteTimeWithZeroSecond,
  getCurrentDateWithoutTime: getCurrentDateWithoutTime,
  getNextMinuteTimeWithNoDateZeroSecond: getNextMinuteTimeWithNoDateZeroSecond,
  // 仿写 Object.values, 兼容
  values: values,
  showInfo: showInfo,
  modelAdapter: modelAdapter,
  request: request,
  getParameterFromURL: getParameterFromURL,
}
