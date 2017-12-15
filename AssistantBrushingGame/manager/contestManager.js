const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')
function getHomePage() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.homePage
    var data = {
      memberId: loginManager.getMemberId()
    }
    baseTool.print(url)
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

/**
 * 添加参赛者
 */
function addContestUser(name = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContestUser
    var data = {
      name: name,
      brushingMethodId: brushingMethodId,
      memberId: loginManager.getMemberId()
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

/**
 * 获得参赛名单
 */
function getContestUserList() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getContestUserList
    var data = {
      memberId: loginManager.getMemberId()
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

/**
 * 获得参赛名单
 */
function selectContestUser(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.selectContestUser
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId
    }
    baseTool.print(data)
    baseTool.print(url)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
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

/**
 * 创建比赛
 */
function addContest(gameId = undefined, name = undefined) {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContest
    var data = {
      memberId: loginManager.getMemberId(),
    }

    if (gameId) {
      data.gameId = gameId
    }

    if (name) {
      data.name = name
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

/**
 * 创建比赛
 */
function deleteContest(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.deleteContest
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId,
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

function bindContestUser(gameId = '', player = '', playerId = '', macAddress = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindContestUser
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId,
      player: player,
      playerId: playerId,
      macAddress: macAddress,
      brushingMethodId: brushingMethodId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.msg);
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

function updatePlayers(name = '', playerId = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.updatePlayers
    var data = {
      memberId: loginManager.getMemberId(),
      name: name,
      playerId: playerId,
      brushingMethodId: brushingMethodId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
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

function delPlayers(playerId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.delPlayers
    var data = {
      memberId: loginManager.getMemberId(),
      playerId: playerId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
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

function uploadBrushRecord() {
  return new Promise((resolve, reject) => {
    baseTool.print('从本地数据库上传数据！')
    var that = this;
    var dataStorageAll = new Array()
    wx.getStorage({
      key: 'dataObjectList',
      success: function (res) {
        dataStorageAll = res.data;
        console.log('wx getStorage', res.data)
        if (dataStorageAll != null && dataStorageAll.length >= 1) {
          var jsonData = JSON.stringify(dataStorageAll)
          console.log('send:', jsonData, that.data);
          console.log('jsonData:', jsonData)
          var url = baseURL.baseBrushDomain + baseApiList.uploadRecord
          baseTool.print(url)
          wx.request({
            //上传数据接口
            url: url,
            //如果设为json，会尝试对返回的数据做一次 JSON.parse
            dataType: 'json',
            data: {
              sign: '123456',
              timestamp: Date.parse(new Date()),
              data: jsonData,
            },
            header: {
              "sourceType": "wx",
              'content-type': 'application/x-www-form-urlencoded', // 默认值
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              //上传数据返回成功之后刷新主页分数
              baseTool.print(res)
              if (res.data.code == 'success') {
                resolve(res.data.data);
                //清空数据
                //成功之后 移除数据
                wx.removeStorage({
                  key: 'dataObjectList',
                  success: function (res) {
                    console.log(res.data)
                    console.log('wx data remove', dataStorageAll)
                  }
                })
              } else {
                if (res.data.msg != 'memberId不能为空') {
                  reject(res.data.msg)
                }
              }
            },
            fail: function (res) {
              reject(baseTool.errorMsg)
            }
          })
        }
      }
    })
  })
}

function tagSynGame(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.tagSyn
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
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

module.exports = {
  // 首页接口
  getHomePage: getHomePage,
  // 添加比赛用户
  addContestUser: addContestUser,
  // 获得用户列表
  getContestUserList: getContestUserList,
  // 添加比赛
  addContest: addContest,
  // 选择参赛用户页面
  selectContestUser: selectContestUser,
  // 删除比赛
  deleteContest: deleteContest,
  // 绑定参赛者
  bindContestUser: bindContestUser,
  // 更新用户信息
  updatePlayers: updatePlayers,
  // 删除用户
  delPlayers: delPlayers,
  // 上传刷牙数据
  uploadBrushRecord: uploadBrushRecord,
  // 标识同步
  tagSynGame: tagSynGame,
}