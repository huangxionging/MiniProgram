const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

/**
 * @param code 登录状态码
 * @param userInfo 用户信息
 */
function getUserInfo() {
  return new Promise((resolve, reject) => {
    baseWechat.getUserInfo().then(res => {
      baseTool.print(res)
      resolve(res)
    }).catch(reject)
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
      // memberId = 'fff'
      if (memberId) {
        resolve(memberId)
      } else {
        reject({
          reason : 'memberId 为空',
          code : '123'})
      }
    }).catch(res => {
      reject({
        reason: 'memberId 为空',
        code: '123'
      })
    })
  })
}

function checkUserBindingState(code = '', userInfo = {}) {
  return new Promise((resolve, reject) => {

    baseTool.print('sdcsdcs')
    baseTool.print(code)
    baseTool.print(userInfo)
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.login

    var data = {'code': code}
    // 头像
    if (userInfo.avatarUrl) {
      data.headimgurl = userInfo.avatarUrl
    }
    // 昵称
    if (userInfo.nickName) {
      data.nickname = userInfo.nickName
    }
    // 性别
    if (userInfo.gender) {
      data.sex = userInfo.gender
    }
    // 语言
    if (userInfo.language) {
      data.language = userInfo.language
    }
    // 国家
    if (userInfo.country) {
      data.country = userInfo.country
    }
    // 省份
    if (userInfo.province) {
      data.province = userInfo.province
    }
    // 城市
    if (userInfo.city) {
      data.city = userInfo.city
    }
    // 参数
    baseTool.print(data)
    // url
    baseTool.print(url)
    wx.request({
      url: url,
      data: data,
      
      success: res => {
        // baseTool.print(res)
        resolve(res)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
  
}

/**
 * 重启页面
 */
function reLauch() {
  wx.reLaunch({
    url: '/pages/contest/contest',
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

/**
 * 根据手机号获取验证码
 */
function getVerifyCode(telphoneNumber = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseApiList.getVerifyCode
    var data = { 'telephone': telphoneNumber}
    var openid = baseTool.valueForKey('openid')
    if (openid) {
      data.openid = openid
    }
    wx.request({
      url: url,
      data: data,

      success: res => {
        // baseTool.print(res)
        resolve(res)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}


function bindingTelphone(telphoneNumber = '', validcode = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindPhoneNumber
    var data = { 'telephone': telphoneNumber, 'validcode': validcode}
    var openid = baseTool.valueForKey('openid')
    if (openid) {
      data.openid = openid
    }
    wx.request({
      url: url,
      data: data,

      success: res => {
        // baseTool.print(res)
        resolve(res)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}


module.exports = {
  checkState: checkState,
  login: login,
  getUserInfo: getUserInfo,
  reLauch: reLauch,
  checkUserBindingState: checkUserBindingState,
  getVerifyCode: getVerifyCode,
  bindingTelphone: bindingTelphone,
}