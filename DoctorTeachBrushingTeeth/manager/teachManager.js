const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getTeachVideoInfo() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getVideoDetails
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

module.exports = {
  getTeachVideoInfo: getTeachVideoInfo,
  getBrushingVideoDetails: getBrushingVideoDetails,
  getDoctorAvatar: getDoctorAvatar,
  getDoctorName: getDoctorName
}