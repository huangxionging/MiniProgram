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
 * code: 登陆后获取的 code
 * userInfo: 用户授权的用户信息
 * doctorId: 医生 id
 */
function loginWithUserInfo(code, userInfoData) {
  return new Promise((resolve, reject) => {
    baseTool.print(code)
    let userInfo = userInfoData.userInfo
    baseTool.print(userInfo)
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
    baseTool.getRemoteDataFromServer("login", "授权信息", data).then(resolve, reject)
  })
}

function reLauch() {
  baseTool.print('重启页面')
  wx.reLaunch({
    url: '/pages/home/homeIndex'
  })
}

function startAuthorization(){
  wx.reLaunch({
    url: '/pages/authorization/authorization',
  })
}

function getVerifyCode(telphoneNumber = '') {
  
  return new Promise((resolve, reject) => {

    let openid = getOpenId()
    baseTool.print(openid)
    if (openid) {
      let data = {
        openid: openid,
        'telephone': telphoneNumber
      }
      // 统一处理
      baseTool.getRemoteDataFromServer("getVerifyCode", "获取验证码", data).then(resolve, reject)
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
      let data = {
        openid: openid,
        validcode: validcode,
        telephone: telphoneNumber
      }
      // 统一处理
      baseTool.getRemoteDataFromServer("bindPhoneNumber", "登录", data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}

/**
 * @brief 完善诊所信息
 */
function completeClinicInfo(tip = '') {
  return new Promise((resolve, reject) => {
    let clinicId = baseTool.valueForKey('clinicId')
    if (clinicId == undefined || clinicId == '') {
      wx.showModal({
        title: '完善单位信息',
        content: '完善比赛单位信息后才能' + tip + '哦~',
        showCancel: true,
        cancelText: '暂时没空',
        cancelColor: '#000',
        confirmText: '完善信息',
        confirmColor: '#00a0e9',
        success: function (res) {
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/my/myClinic/myClinic',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      resolve("")
    }
  })
}

function getRemoteDataFromServer(urlApi = '', description = '', parameter = {}) {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    let memberId = getMemberId()

    if (openid && memberId) {
      // 统一处理
      let data = {
        memberId: memberId,
        openid: openid,
      }
      data  = Object.assign(data, parameter)
      baseTool.print(data)
      baseTool.getRemoteDataFromServer(urlApi, description, data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}
 

module.exports = {
  getOpenId: getOpenId,
  getMemberId: getMemberId,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  loginWithUserInfo: loginWithUserInfo,
  getVerifyCode: getVerifyCode,
  bindingTelphone: bindingTelphone,
  completeClinicInfo: completeClinicInfo,
  getRemoteDataFromServer: getRemoteDataFromServer
}