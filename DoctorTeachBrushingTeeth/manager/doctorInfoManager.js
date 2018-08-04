const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getDoctorInfo(){
  return new Promise((resolve, reject) => {
    let openId = loginManager.getOpenId()
    if (openId) {
      resolve(openId)
    } else {
      loginManager.startAuthorization()
    }
  });
  
}


module.exports = {
  /**
   * 获得医生信息
   */
  getDoctorInfo: getDoctorInfo,
}