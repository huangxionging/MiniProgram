//app.js
const wechat = require('./utils/baseWeChat.js')
const loginManager = require('./manager/loginManager.js')
const baseWechat = require('./utils/baseWeChat.js')
const baseURL = require('./utils/baseURL.js')
const baseTool = require('./utils/baseTool.js')
App({
  onLaunch: function () {
    loginManager.loginFlow()
  },
  globalData: {
    userInfo: null
  },
  onHide: function() {
  },
  onShow: function() {
  }
})