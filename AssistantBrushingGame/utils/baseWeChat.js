

module.exports = {
  /**
   * 检查会话是否过期
   */
  checkSession: () => {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: resolve,
        fail: reject,
        complete: function (res) {},
      })
    })
    
  },
  /**
   * 登录
   */
  login: () => {
    return new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject,
        complete: function (res) {},
      })
    })
  },
  /**
   * 获得用户信息
   */
  getUserInfo: () => {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: resolve,
        fail: reject,
        complete: function(res) {},
      })
    })
  }
}