const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getMyGameCount() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getMyGameCount
    var data = {
      memberId: loginManager.getMemberId(),
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function pageQueryContest(pageNo = 1) {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.pageQueryContest
    var data = {
      memberId: loginManager.getMemberId(),
      pageNo: pageNo
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function getContestgMembers(gameId ='') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getContestgMembers
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function mergeData(gameIds) {

  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.mergeData
    var data = {
      memberId: loginManager.getMemberId(),
      gameIds: gameIds
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
  
}

function brushScoreReport(recordId='', name = '', clinicName = '') {
  return new Promise((resolve, reject) => {
    var url = 'https://32teeth.cn/tem_img/html2png.php'
    var data = {
      recordId: recordId,
      name: name,
      zs_name: clinicName
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function(res){
        resolve(res.data)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

function updateClinicInfo(name = '', imagUrl = ''){
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.updateClinicInfo
    var data = {
      clinicPic: imagUrl,
      clinicName: name,
      openId: baseTool.valueForKey('openid')
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

function getClinicInfo(){
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getClinicInfo
    var data = {
      openId: baseTool.valueForKey('openid')
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
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

function getUploadToken(filePath = '') {
  baseTool.print(filePath)
  return new Promise((resolve, reject) => {
    var fileName = filePath.split('//')[1];
    var url = 'http://doctor.32teeth.cn/sys/api/getUploadToken/imageName/' + fileName 
    baseTool.print(url)
    wx.request({
      url: url,
      success: function (res) {
        resolve(res);
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getContestUserCount() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {

        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        if (contestUserObject != undefined && contestUserList != undefined) {
          resolve(contestUserList.length)
        } else {
          reject('数据错误')
        }
        
      },
      fail: function (res) {
        baseTool.print(res)
        resolve(res)
      },
      complete: function (res) { },
    })
  })
}
module.exports = {
  pageQueryContest: pageQueryContest,
  getMyGameCount: getMyGameCount,
  getContestgMembers: getContestgMembers,
  mergeData: mergeData,
  brushScoreReport: brushScoreReport,
  updateClinicInfo: updateClinicInfo,
  getClinicInfo: getClinicInfo,
  getUploadToken: getUploadToken,
}