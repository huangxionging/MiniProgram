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
      resolve(res)
    }).catch(res => {
      // baseTool.print(res)
      reject(res)
    })
  })
}

/**
 * 登录接口
 */
function login() {
  return new Promise((resolve, reject) => {
    baseWechat.login().then(res => {
      baseTool.print(res)
      resolve(res)
    }).catch(err => {
      wx.showModal({
        title: '网络错误',
        content: '请检查网络是否连接',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
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
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          reject(res.data.msg)
        }
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
  baseTool.print('ddd')
  wx.reLaunch({
    url: '/pages/contest/contest/contest',
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
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getVerifyCode
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
        if (res.data.code == 'success') {
          resolve(res.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 绑定手机号
 */
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
        baseTool.print(res)
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 登陆流程
 */
function loginFlow() {
  return new Promise((resolve, reject) => {
    // 检查状态
    var checkStateAction = checkState()
    // 成功
    checkStateAction.then(res => {
      baseTool.print(res)
      // reLauch()
      getUserInfo().then(res => {
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        resolve(res)
      }).catch(res => {
        
        reject(res)
      })
    }).catch(res => {
      baseTool.print(res)
      return baseTool.defaultPromise()
    })

    // 会话过期需要登录
    var loginAction = baseTool.bindCatchPromise(checkStateAction, login)

    var code
    // 登录成功, 获得 code
    loginAction.then(res => {
      baseTool.print([res, '结果'])
      code = res.code
    })
    // 登录成功之后获取用户信息 loginManager.getUserInfo()
    var getUserInfoAction = baseTool.bindThenPromise(loginAction, getUserInfo)
    // 读取用户信息成功之后与服务器进行通讯
    var checkUserBindingStateAction = getUserInfoAction.then(res => {
      baseTool.print(res)
      const app = getApp()
      app.globalData.userInfo = res.userInfo
      return checkUserBindingState(code, res.userInfo)
    }).catch(res => {
      baseTool.print(res)
      reject(res)
    })

    // 和服务器通信结果
    checkUserBindingStateAction.then(res => {
      // 表示已经绑定
      if (res && res.wxUser) {
        baseTool.print(res.wxUser)
        var wxUser = res.wxUser
        if (wxUser.memberId) {
          baseTool.setValueForKey(wxUser.memberId, 'memberId')
          baseTool.setValueForKey(wxUser.openid, 'openid')
          // reLauch()
          resolve(wxUser)
        } else if (wxUser.openid) {
          baseTool.setValueForKey(wxUser.openid, 'openid')
          // wx.redirectTo({
          //   url: '/pages/login/binding/binding',
          // })
          resolve({
            redirectTo: '/pages/login/binding/binding'
          })
        } else {
          reject(res)
        }
      } else {
        reject(res)
      }
    })
  })
}

function getMemberId() {

  var memeberId = baseTool.valueForKey('memberId')
  if (memeberId) {
    return memeberId
  } else {
    loginFlow().then(res => {
      var app = getApp()

      // 回调
      // 去到绑定页面
      if (res.redirectTo) {
        wx.redirectTo({
          url: res.redirectTo,
        })
      } else {
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res)
        }
        
      }
      
    }).catch(res => {
      baseTool.print(res)
    })
    return ''
  }
}
module.exports = {
  checkState: checkState,
  login: login,
  getUserInfo: getUserInfo,
  reLauch: reLauch,
  checkUserBindingState: checkUserBindingState,
  getVerifyCode: getVerifyCode,
  bindingTelphone: bindingTelphone,
  loginFlow: loginFlow,
  getMemberId: getMemberId,
}