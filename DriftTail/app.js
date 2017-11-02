//app.js

const baseConfig = require('/utils/baseURL.js')
// 引入工具
const baseTool = require('/utils/baseTool.js')

var isLogin = false

App({
  onLaunch: function (e) {
<<<<<<< Updated upstream
    // baseTool.setValueForKey('黄雄')
    // var value =  baseTool.valueForKey()
  
    // baseTool.removeAllObjects()
    baseTool.removeObjectForKey('dd')
  
=======
  
  /**
   * 检查登录状态
   */
  wx.checkSession({
    success: function(res) {
      console.log('res')
      console.log(res)
      // var sessionKey = 
      wx.redirectTo({
        url: '../../pages/payMoney/payMoney',
      })
    },
    fail: function() {
      // 检查登录状态失败, 重新登录
     
    }
  })

  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      for (var index = 0; index < 100; ++index)
        wx.redirectTo({
          url: '../../pages/binding/binding',
        })
      console.log(res)
      console.log(baseConfig.baseDomain() + baseConfig.basePath + 'getWxUserInfo')

      //   wx.request({
      //     url: baseURL + 'getWxUserInfo',
      //     data: {
      //       'code': res.code
      //     },
      //     success: res => {
      //       console.log(res)
      //     },
      //     complete: res => {
      //       console.log(res)
      //     },
      //     fail: res => {
      //       console.log(res)
      //     }
      //   })
    },
    fail: res => {

    }
  })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'userInfo',
            success: res => {
              console.log(res)
            },
            fail: res => {
              console.log(res)
            }
          })
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              console.log(res.userInfo)
            },
            fail: res => {
              console.log(res)
            }
          })
        }
      }
    })

>>>>>>> Stashed changes
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
    wx.getUserInfo({
      success: res => {
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
      fail: res => {

      }
    })
  }
})
