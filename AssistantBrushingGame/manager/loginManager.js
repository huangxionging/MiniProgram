const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

/**
 * @param code 登录状态码
 * @param userInfo 用户信息
 */
function getUserInfo(code, userInfo) {
  return new Promise((resolve, reject) => {
    baseWechat.getUserInfo().then(res => {

    }).catch(reject)

    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getWxUserInfo
    wx.request({
      url: url,
      data: {
        code: code,
        headPic: userInfo
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      success: res => {
        baseTool.print(res)
        resolve(res)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 登录接口
 */
function login() {

  return new Promise((resolve, reject) => {
    baseWechat.login().then(res => {
      // baseTool.print(res.code)
      resolve(res)
    }).catch(err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络是否连接',
        showCancel: false,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      reject
    })
    // var getUserInfo = login.then((res) => {
    //   // 有 code 表示重新登录
    //     baseWechat.getUserInfo().then(res => {
    //       baseTool.print(res)
    //       return getUserInfo(code, res.userInfo)
    //     }).then(res => {
    //       baseTool.print(res)
    //       resolve(res)
    //     })
    // }).catch(res => {
    //   baseTool.print(res)
    // })
    // getUserInfo.then(res => {
    //   baseTool.print(res)
    // })
  })
}

/**
 * 检查状态
 */
function checkState() {
  return new Promise((resolve, reject) => {
    // 检查会话
    baseWechat.checkSession().then((res) => {
      // 获取 memberId
      var memberId = baseTool.valueForKey('memberId')
      // 如果 存在则结束流程
      memberId = 'fff'
      if (memberId) {
        resolve(memberId)
      } else {
        reject({
          reson : 'memberId 为空',
          code : '123'})
      }
    }).catch(res => {
      reject({
        reson: 'memberId 为空',
        code: '123'
      })
    })
  })
}

/**
 * 重启页面
 */
function reLauch() {
  wx.reLaunch({
    url: 'pages/contest/contest',
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

module.exports = {
  checkState: checkState,
  login: login,
  getUserInfo: getUserInfo,
  reLauch: reLauch
    
}