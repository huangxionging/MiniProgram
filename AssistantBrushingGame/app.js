//app.js
const wechat = require('./utils/baseWeChat.js')
const loginManager = require('./manager/loginManager.js')
const baseWechat = require('./utils/baseWeChat.js')
const baseURL = require('./utils/baseURL.js')
const baseTool = require('./utils/baseTool.js')
const bluetoothManager = require('./manager/bluetoothManager.js')
App({
  onLaunch: function () {
    // 执行登陆流程, 确保随时处于登陆状态
    loginManager.loginFlow().then(res => {
      // baseTool.print(res)
    }).catch(res => {
      // baseTool.print(res)
    })
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