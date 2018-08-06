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
  });
}

module.exports = {
  getTeachVideoInfo: getTeachVideoInfo
}