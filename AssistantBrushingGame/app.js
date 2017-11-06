//app.js
const wechat = require('./utils/baseWeChat.js')
const loginManager = require('./manager/loginManager.js')
const baseWechat = require('./utils/baseWeChat.js')
const baseURL = require('./utils/baseURL.js')
const baseTool = require('./utils/baseTool.js')
App({
  onLaunch: function () {

    // wx.getUserInfo({
    //   success: function (res) { console.log(res) },
    //   fail: function (res) { console.log(res) },
    //   complete: function (res) { console.log(res) },
    // })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
  },
  globalData: {
    userInfo: null
  },
  onHide: function() {

  },
  onShow: function() {
    // 检查状态
    var checkState = loginManager.checkState()
    // 成功
    checkState.then(res => {
      baseTool.print(res)
      loginManager.reLauch()
    }).catch(res => {
      baseTool.print(res)
    })

    // 会话过期之后的操作
    var login = baseTool.bindCatchPromise(checkState, loginManager.login())

    // 进行登录操作
    var code
    login.then(res => {
      baseTool.print(res)
      code = res.code
    })
    // 登录成功之后获取用户信息 loginManager.getUserInfo()
  
  var getUserInfo = baseTool.bindThenPromise(login, loginManager.getUserInfo())


    var checkUserBindingState = getUserInfo.then(res => {
      // baseTool.print(code)
      baseTool.print(res)
      this.globalData.userInfo = res.userInfo
      return loginManager.checkUserBindingState(code, res.userInfo)
    })

    // 检查结果
    checkUserBindingState.then(res => {
      baseTool.print(res.data.data)
      // 表示已经绑定
      var wxUser = res.data.data.wxUser
      if (wxUser.memberId) {
        baseTool.setValueForKey(wxUser.memberId, 'memberId')
        loginManager.reLauch()
      } else if (wxUser.openid) {
        baseTool.setValueForKey(wxUser.openid, 'openid')
        wx.redirectTo({
          url: '/pages/binding/binding',
        })
      }
    })

  }
})