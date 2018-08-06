const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getDoctorInfo(){
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid) {
      
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.homePage
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
/**
 * 刷牙报告
 */
function brushScoreReport(recordId = '') {
  return new Promise((resolve, reject) => {
    let url = 'https://32teeth.cn/tem_img/html2png_weixin.php'
    let data = {
      recordId: recordId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        resolve(res.data)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}


module.exports = {
  getDoctorInfo: getDoctorInfo,
  brushScoreReport: brushScoreReport,
}