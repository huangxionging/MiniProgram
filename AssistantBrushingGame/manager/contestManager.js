const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

function getHomePage() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.homePage
    var data = {
      memberId: baseTool.valueForKey('memberId')
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

/**
 * 添加参赛者
 */
function addContestUser(name = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContestUser
    var data = {
      name: name,
      brushingMethodId: brushingMethodId,
      memberId: baseTool.valueForKey('memberId')
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

/**
 * 获得参赛名单
 */
function getContestUserList() {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getContestUserList
    var data = {
      memberId: baseTool.valueForKey('memberId')
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

/**
 * 获得参赛名单
 */
function selectContestUser(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.selectContestUser
    var data = {
      memberId: baseTool.valueForKey('memberId'),
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

/**
 * 创建比赛
 */
function addContest(gameId = undefined, name = undefined) {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContest
    var data = {
      memberId: baseTool.valueForKey('memberId'),
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

/**
 * 创建比赛
 */
function deleteContest(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.deleteContest
    var data = {
      memberId: baseTool.valueForKey('memberId'),
      gameId: gameId,
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

function bindContestUser(gameId = '', player = '', playerId = '', macAddress = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindContestUser
    var data = {
      memberId: baseTool.valueForKey('memberId'),
      gameId: gameId,
      player: player,
      playerId: playerId,
      macAddress: macAddress,
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

function updatePlayers(name = '', playerId = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.updatePlayers
    var data = {
      memberId: baseTool.valueForKey('memberId'),
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

function delPlayers(playerId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.delPlayers
    var data = {
      memberId: baseTool.valueForKey('memberId'),
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
}