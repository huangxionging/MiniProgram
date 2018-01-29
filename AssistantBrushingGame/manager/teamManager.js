const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function addClass(title = '', duration = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addClass
    var data = {
      memberId: loginManager.getMemberId(),
      clinicId: baseTool.valueForKey('clinicId'),
      title: title,
      duration: duration
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          baseTool.print(res)
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

function pageQueryClass(pageNo = 1){
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.pageQueryClass
    var data = {
      memberId: loginManager.getMemberId(),
      clinicId: baseTool.valueForKey('clinicId'),
      pageNo: pageNo
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          baseTool.print(res)
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

function getTeamDetails(teamId = '') {
  return new Promise((resolve, reject) => {
    var url = 'https://32teeth.cn/pl/doctor/match_list'
    var data = {
      room_id: teamId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.s == 1) {
          baseTool.print(res)
          resolve(res.data);
        } else {
          reject(baseTool.errorMsg)
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function updateClassTitle(title = '', classId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.updateClassTitle
    var data = {
      memberId: loginManager.getMemberId(),
      classId: classId,
      title: title
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          baseTool.print(res)
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

module.exports = {
  addClass: addClass,
  pageQueryClass: pageQueryClass,
  getTeamDetails: getTeamDetails,
  updateClassTitle: updateClassTitle,
}