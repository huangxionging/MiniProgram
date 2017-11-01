//app.js

const baseConfig = require('/utils/baseURL.js')
// 引入工具
const baseTool = require('/utils/baseTool.js')

var isLogin = false

App({
  onLaunch: function (e) {
    // baseTool.setValueForKey('黄雄')
    // var value =  baseTool.valueForKey()
  
    // baseTool.removeAllObjects()
    baseTool.removeObjectForKey('dd')
  
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
