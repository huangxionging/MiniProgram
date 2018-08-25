const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

/**
 * 获得刷牙记录
 */
function getBrushRecord() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getTopDeviceMemberRecord
      let doctorId = baseTool.valueForKey('doctorId')
      let data = {
        doctorId: doctorId,
        openid: openid
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 获得手机号
 */
function getTelphone() {
  return baseTool.valueForKey('telephone')
}

/**
 * 加入训练营
 */
function getJoinTrainingCamp() {
  return baseTool.valueForKey('isJoinTrainingCamp')
}

/**
 * 根据手机号获取验证码
 */
function getVerifyCode(telphoneNumber = '') {

  return new Promise((resolve, reject) => {

    let openid = loginManager.getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getVerifyCode
      let doctorId = baseTool.valueForKey('doctorId')
      let data = {
        doctorId: doctorId,
        openid: openid,
        'telephone': telphoneNumber
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 绑定手机号
 */
function bindingTelphone(telphoneNumber = '', validcode = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindPhoneNumber
      let doctorId = baseTool.valueForKey('doctorId')
      let data = {
        doctorId: doctorId,
        openid: openid,
        validcode: validcode,
        telephone: telphoneNumber
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 获得跟刷视频详情
 */
function getBrushingVideoDetails() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getBrushingVideoDetails
      let doctorId = baseTool.valueForKey('doctorId')
      let data = {
        doctorId: doctorId,
        openid: openid
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 获得医生头像
 */
function getDoctorAvatar() {
  let doctorInfo = baseTool.valueForKey('doctorInfo')
  if (doctorInfo && doctorInfo.doctorHeadimgurl) {
    return doctorInfo.doctorHeadimgurl
  } else {
    return ''
  }
}

/**
 * 获得医生名称
 */
function getDoctorName() {
  let doctorInfo = baseTool.valueForKey('doctorInfo')
  if (doctorInfo && doctorInfo.doctorName) {
    return doctorInfo.doctorName
  } else {
    return ''
  }
}

function getUserMemberId() {
  return baseTool.valueForKey('memberId')
}

/**
 * 加入训练营
 */
function joinTrainingCamp() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.joinTrainingCamp
      let memberId = getUserMemberId()
      let data = {
        memberId: memberId,
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 训练营首页
 */
function trainingCampHomeForMember() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.trainingCampHomeForMember
      let memberId = getUserMemberId()
      let data = {
        memberId: memberId,
        openid: openid
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 获得动态信息内容
 */
function getTrainingCampDynamic() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getTrainingCampDynamic
      let memberId = getUserMemberId()
      let data = {
        memberId: memberId,
        openid: openid
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 签到
 */
function signIn() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.signIn
      let memberId = getUserMemberId()
      let data = {
        memberId: memberId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

module.exports = {
  getBrushRecord: getBrushRecord,
  getTelphone: getTelphone,
  getVerifyCode: getVerifyCode,
  bindingTelphone: bindingTelphone,
  getBrushingVideoDetails: getBrushingVideoDetails,
  getDoctorAvatar: getDoctorAvatar,
  getDoctorName: getDoctorName,
  getJoinTrainingCamp: getJoinTrainingCamp,
  joinTrainingCamp: joinTrainingCamp,
  trainingCampHomeForMember: trainingCampHomeForMember,
  getTrainingCampDynamic: getTrainingCampDynamic,
  signIn: signIn
}