
const baseURL = require('/baseURL.js')

// 获得状态
var baseState = baseURL.baseState
// 系统信息
var systemInfo = wx.getSystemInfoSync()
// 品牌名称
var brand = String(systemInfo.brand).toLowerCase()
// 是否模拟器
var isSimulator = (brand == 'devtools')

/**
 * e 是要打印的参数
 */
function print(e) {
  // 测试环境下或者模拟器状态下, 才输入内容到控制台
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
  var that = this
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
  // 震动
  vibrate: vibrate,
  getNet: function () {
    var that = this
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
}