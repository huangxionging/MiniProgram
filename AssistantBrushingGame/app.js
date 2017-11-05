//app.js
const wechat = require('./utils/baseWeChat.js')
const loginManager = require('./manager/loginManager.js')
const baseWechat = require('./utils/baseWeChat.js')
const baseURL = require('./utils/baseURL.js')
const baseTool = require('./utils/baseTool.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 检查登录状态
    // loginManager.checkState().then(res => {
    //   baseTool.print(res)
    // }).then(loginManager.reLauch).catch(res => {
    //   return loginManager.login()
    // }).then(res => {
    //   baseTool.print('ddd')
    //   baseTool.print(res)
    // })

    var checkState = loginManager.checkState()

    var login = loginManager.login()

    // var p1 = checkState.then(res => {
    //   return baseTool.defaultPromise
    // }).catch(res => {
    //   baseTool.print(res)
    //   return login
    // })
    var p1 = baseTool.setCatchPromise(checkState, login)

    p1.then(res => {
      baseTool.print('dgggjgjkkkkkkk')
      baseTool.print(res)
      baseTool.print(res)
    })
    

    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        baseTool.print(res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // wx.openSetting({
          //   success: function (res) {
          //     baseTool.print('ddd')
          //     wx.redirectTo({
          //       url: '/pages/index/index',
          //     })
          //   },
          //   fail: function (res) { baseTool.print(res)},
          //   complete: function (res) { baseTool.print(res)},
          // })
        }
      }, 
    })
  },
  globalData: {
    userInfo: null
  }
})