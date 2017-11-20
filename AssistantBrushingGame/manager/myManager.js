const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')


function getMyGameCount() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getMyGameCount
    var data = {
      memberId: baseTool.valueForKey('memberId'),
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          reject(res.data.msg)
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
      memberId: baseTool.valueForKey('memberId'),
      pageNo: pageNo
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          reject(res.data.msg)
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
      memberId: baseTool.valueForKey('memberId'),
      gameId: gameId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          reject(res.data.msg)
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

module.exports = {
  pageQueryContest: pageQueryContest,
  getMyGameCount: getMyGameCount,
  getContestgMembers: getContestgMembers,
}