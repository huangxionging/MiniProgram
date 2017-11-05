
const baseURL = require('/baseURL.js')

// 获得状态
var baseState = baseURL.baseState
// 系统信息
var systemInfo = wx.getSystemInfoSync()
// 品牌名称
var brand = String(systemInfo.brand).toLowerCase()
// 是否模拟器
var isSimulator = (brand == 'devtools')

// 添加接口
module.exports = {
  /**
   * 打印
   */
  print: function (e) {
    // 测试环境下或者模拟器状态下, 才输入内容到控制台
    if (baseState || isSimulator) {
       // 打印内容
      console.log(e)
    } 
  },
  /**
   * 是否处于模拟器状态下
   */
  isSimulator: isSimulator,
  /**
   * 系统信息
   */
  systemInfo: systemInfo,
  /**
   * 通过 key 获得值
   */
  valueForKey: function(key = '') {
    return wx.getStorageSync(key)
  },
  /**
   * 设置键值对
   */
  setValueForKey: function(value, key = '') {
    wx.setStorageSync(key, value)
  },
  /**
   * 删除指定的 key 对应的值
   */
  removeObjectForKey: function(key = '') {
    wx.removeStorageSync(key)
  },
  /**
   * 删除所有数据
   */
  removeAllObjects: function() {
    wx.clearStorageSync()
  },
  /**
   * 震动
   */
  vibrate: function() {
    var that = this
    wx.vibrateLong({
      success: function (res) {
        that.print(res)
       },
      fail: function (res) { 
        that.print(res) 
      }
    })
  },
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
  /**
   * 默认的 Promise
   */
  defaultPromise: new Promise((resolve, reject) => {}),
  setCatchPromise: (promise, promiseCatch) => {
    return promise.then(res => {
      return new Promise((resolve, reject) => {})
    }).catch(res => {
      return promiseCatch
    })
  }
}