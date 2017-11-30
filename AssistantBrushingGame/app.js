//app.js
const wechat = require('./utils/baseWeChat.js')
const loginManager = require('./manager/loginManager.js')
const baseWechat = require('./utils/baseWeChat.js')
const baseURL = require('./utils/baseURL.js')
const baseTool = require('./utils/baseTool.js')
const bluetoothManager = require('./manager/bluetoothManager.js')
App({
  onLaunch: function () {
    // loginManager.loginFlow().then(res => {
    //   if (this.userInfoReadyCallback) {
    //     // 回调
    //     this.userInfoReadyCallback(res)

    //     // 去到绑定页面
    //     if (res.redirectTo) {
    //       wx.redirectTo({
    //         url: res.redirectTo,
    //       })
    //     }

    //   }
    // }).catch(res => {

    // })

    
  },
  globalData: {
    userInfo: null,
    deviceList: []
  },
  onHide: function() {
  },
  onShow: function() {
  },
  
})