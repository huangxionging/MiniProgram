//app.js

const baseConfig = require('/utils/baseURL.js')
// 引入工具
const baseTool = require('/utils/baseTool.js')

App({
  onLaunch: function (e) {
    for (var index= 0; index < 1000; ++index)
    wx.getSystemInfo({
      success: function(res) {
        baseTool.print(wx.getSystemInfoSync())
      },
    })
   
    wx.login({
      success: res => {
        baseTool.print(res)
      },
      fail: res => {
        baseTool.print(res)
      }
    })
  },
  globalData: {
    userInfo: null,
  },
  onShow: function(e) {
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function() {

  }
})
