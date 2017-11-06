const baseTool = require('./baseTool.js')

function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getUserInfo() {
  
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

module.exports = {
  /**
   * 检查会话是否过期
   */
  checkSession: checkSession,
  /**
   * 登录
   */
  login: login,

  /**
   * 获得用户信息
   */
  getUserInfo: getUserInfo
}