/**
 * 小程序入口, 自动生成
 */
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
    // 控制台日志
    console.log(options)
    // 定义一个 logs 数组
    var logs = wx.getStorageSync('logs') || []
    // 插入当前时间
    logs.unshift(Date.now)

    // 将数组存入本地存储块
    wx.setStorageSync('logs', logs)
  },
  /**
   * 获取用户信息, 在 Index.js 中会用到
   * cb 意思是 callback 回调函数
   */
  getUserInfo: function(cb) {
    var that = this
    if(this.globalData.userInfo) {
      // 判断
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  /**
   * 全局数据
   */
  globalData: {
    userInfo: null
  }
})
