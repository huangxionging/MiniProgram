const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getTodayDynamic(memberId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getTodayDynamic
      let data = {
        memberId: memberId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  });
}


module.exports = {
  getTodayDynamic: getTodayDynamic
}