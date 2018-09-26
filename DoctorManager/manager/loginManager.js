const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

/**
 * 获取 openId
 */
function getOpenId() {
  return baseTool.valueForKey('openid')
}

function getMemberId() {
  return baseTool.valueForKey('memberId')
}

/**
 * 扫码进入
 */
function getDoctorId() {
  return baseTool.valueForKey('doctorId')
}

/**
 * code: 登陆后获取的 code
 * userInfo: 用户授权的用户信息
 * doctorId: 医生 id
 */
function loginWithUserInfo(code, userInfoData) {
  return new Promise((resolve, reject) => {
    baseTool.print(code)
    let userInfo = userInfoData.userInfo
    baseTool.print(userInfo)
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.login
    let data = { 
      'code': code
    }

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
    if (userInfoData.encryptedData) {
      data.encryptedData = userInfoData.encryptedData
    }

    if (userInfoData.iv) {
      data.iv = encodeURI(userInfoData.iv)
      encodeURI()
      encodeURIComponent()
    }
    // 参数
    baseTool.print(data)
    // url
    baseTool.print(url)
    baseTool.request(url, data).then(resolve, reject)
  })
}

function reLauch() {
  baseTool.print('重启页面')
  wx.reLaunch({
    url: '/pages/home/homeIndex/homeIndex'
  })
}

function startAuthorization(){
  wx.reLaunch({
    url: '/pages/authorization/authorization/authorization',
  })
}

function getVerifyCode(telphoneNumber = '') {
  
  return new Promise((resolve, reject) => {

    let openid = getOpenId()
    baseTool.print(openid)
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getVerifyCode
      let data = {
        openid: openid,
        'telephone': telphoneNumber
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}

/**
 * 绑定手机号
 */
function bindingTelphone(telphoneNumber = '', validcode = '') {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindPhoneNumber
      let data = {
        openid: openid,
        validcode: validcode,
        telephone: telphoneNumber
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}

function getDoctorInfo(doctorId = '') {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid && doctorId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.scanCode
      let data = {
        openid: openid,
        doctorId: doctorId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 绑定二维码
 */
function bindingQrcode(doctorId = '') {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid && doctorId) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindingQrcode
      let data = {
        openid: openid,
        doctorId: doctorId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

module.exports = {
  getOpenId: getOpenId,
  getMemberId: getMemberId,
  getDoctorId: getDoctorId,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  loginWithUserInfo: loginWithUserInfo,
  getVerifyCode: getVerifyCode,
  bindingTelphone: bindingTelphone,
  getDoctorInfo: getDoctorInfo,
  bindingQrcode: bindingQrcode
}