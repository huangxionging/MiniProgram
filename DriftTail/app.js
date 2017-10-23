//app.js

var baseURL = 'https://dev-dos.32teeth.cn/mini/doctorOfflinegame/'
var debug = true
if (!debug) {
  baseURL = 'https://dos.32teeth.cn/mini/doctorOfflinegame/'
}

App({
  onLaunch: function (e) {
  
  /**
   * 检查登录状态
   */
  wx.checkSession({
    success: function(res) {
      console.log('res')
      console.log(res)
      // var sessionKey = 
    },
    fail: function() {
      // 检查登录状态失败, 重新登录
      wx.login({
        success: res => {

        },
        fail: res => {

        }
      })
    }
  })
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        console.log(baseURL + 'getWxUserInfo')
        
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
          // wx.getUserInfo({
          //   withCredentials: true,
          //   success: res => {
          //     console.log(res.userInfo)
          //   },
          //   fail: res => {
          //     console.log(res)
          //   }
          // })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function() {

  }
})