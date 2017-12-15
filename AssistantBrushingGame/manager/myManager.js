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

function brushScoreReport(recordId='', name = '') {
  return new Promise((resolve, reject) => {
    var url = 'https://32teeth.cn/tem_img/html2png.php'
    var data = {
      recordId: recordId,
      name: name
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

module.exports = {
  pageQueryContest: pageQueryContest,
  getMyGameCount: getMyGameCount,
  getContestgMembers: getContestgMembers,
  mergeData: mergeData,
  brushScoreReport: brushScoreReport
}