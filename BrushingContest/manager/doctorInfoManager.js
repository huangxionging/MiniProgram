const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getDoctorInfo(memberId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getDoctorInfo
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

/**
 * 生成二维码地址
 */
function getDoctorQRCodeURL(doctorId = '') {
  let url = 'https://32teeth.cn/index/index/createQrcode?str='
  let parameter = "https://dos.32teeth.cn/static/min/doctorTeachesBrushing/qrcode?doctorId=" + doctorId
  return url + parameter
}

/**
 * 生成跳转医生端二维码
 */
function getDoctorManagerQRCodeURL(doctorId = '') {
  let url = 'https://32teeth.cn/index/index/createQrcode?str='
  let parameter = "https://dos.32teeth.cn/static/min/doctorInfoEdit/qrcode?doctorId=" + doctorId
  return url + parameter
}

function getDoctorPosterQRCodeURL(doctorId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    let memberId = loginManager.getMemberId()
    if (openid && memberId) {
      // 海报生成地址
      let url = "https://32teeth.cn/tem_img/doctor_qr_png.php?doctorId=" + doctorId
      // 统一处理
      wx.request({
        url: url,
        success: function(res) {
          // 返回图片地址
          if (res.statusCode == 200) {
            resolve(res.data)
          }
        },
        fail: function(res) {
          baseTool.print(res)
          reject(res)
        },
      })
    } else {
      loginManager.startAuthorization()
    }
  })
}

/**
 * 生成医生端海报
 */
function getDoctorManagerPosterQRCodeURL(doctorId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    let memberId = loginManager.getMemberId()
    if (openid && memberId) {
      // 海报生成地址
      let url = "https://32teeth.cn/tem_img/doctor_qr_png_zwkqfxgl.php?doctorId=" + doctorId
      // 统一处理
      wx.request({
        url: url,
        success: function(res) {
          // 返回图片地址
          if (res.statusCode == 200) {
            resolve(res.data)
          }
        },
        fail: function(res) {
          baseTool.print(res)
          reject(res)
        },
      })
    } else {
      loginManager.startAuthorization()
    }
  })
}




function updateDoctorInfo(doctorInfo = {}) {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    let memberId = loginManager.getMemberId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.updateDoctorInfo
      // 添加 memberId
      doctorInfo.memberId = memberId

      // 统一处理
      baseTool.request(url, doctorInfo).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

function doctorInfoComplete(doctorInfo = {}) {
  let complete = false
  baseTool.print(doctorInfo)
  if (doctorInfo.avatar && doctorInfo.doctorName && doctorInfo.department && doctorInfo.jobTitle && doctorInfo.hospital && doctorInfo.goodat && doctorInfo.experience) {
    complete = true
  }
  return complete
}

/**
 * 选择医生头像
 * items 来源参数, 以冒号隔开
 * url 是图片原有地址
 */
function chooseDoctorAvatar(items = '', url = '') {
  return new Promise((resolve, reject) => {
    baseTool.showSheetInfo(items).then(res => {
      baseTool.print(res)
      switch (res) {
        case 0:
        case 1:
          {
            let chooseItem = ['camera', 'album']
            baseTool.chooseImageFrom(chooseItem[res]).then(res => {
              let url = baseURL.baseDomain + baseApiList.uploadImageURL
              let filePath = res
              baseTool.uploadLocalFile(url, filePath).then(res => {
                let data = JSON.parse(res)
                baseTool.print(data)
                if (data && data.picNoList && data.picNoList.length > 0) {
                  resolve('http://qnimage.hydrodent.cn/' + data.picNoList[0])
                } else {
                  reject('上传失败')
                }
              }).catch(reject)
            }).catch(res => {
              baseTool.print(res)
            })
            break
          }
        case 2:
          {
            baseTool.previewSingleImage(url)
            break
          }
      }
    }).catch(res => {
      baseTool.print(res)
    })
  })
}


module.exports = {
  getDoctorInfo: getDoctorInfo,
  getDoctorQRCodeURL: getDoctorQRCodeURL,
  updateDoctorInfo: updateDoctorInfo,
  doctorInfoComplete: doctorInfoComplete,
  chooseDoctorAvatar: chooseDoctorAvatar,
  getDoctorPosterQRCodeURL: getDoctorPosterQRCodeURL,
  getDoctorManagerQRCodeURL: getDoctorManagerQRCodeURL,
  getDoctorManagerPosterQRCodeURL: getDoctorManagerPosterQRCodeURL
}