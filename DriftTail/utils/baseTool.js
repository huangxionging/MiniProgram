
const baseURL = require('/baseURL.js')

// 获得状态
var baseState = baseURL.baseState
// 系统信息
var systemInfo = wx.getSystemInfoSync()
// 品牌名称
var brand = String(systemInfo.brand).toLowerCase()
// 是否模拟器
var isSimulator = (brand == 'devtools')
//  sessionKey 获得
var sessionKey = wx.getStorageSync('sessionKey')


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
  valueForKey: function(key) {
    if (typeof(key) == 'string') {
      return wx.getStorageSync(key)
    } else {
      return null
    }
  },
  /**
   * 设置键值对
   */
  setValueForKey: function(value, key) {
    wx.setStorageSync(key, value)
  }
}